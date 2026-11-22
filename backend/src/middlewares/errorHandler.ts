import type { ErrorRequestHandler, Response } from 'express';
import { ZodError } from 'zod';

import { isProduction } from '../config/env.js';
import type { ApiErrorResponse } from '../types/api.types.js';
import { AppError } from '../utils/AppError.js';
import { formatZodError } from '../utils/formatZodError.js';

interface HttpError extends Error {
  status: number;
  type?: string;
  expose?: boolean;
}

const isHttpError = (err: unknown): err is HttpError =>
  err instanceof Error && 'status' in err && typeof err.status === 'number';

const BODY_PARSER_ERROR_CODES: Record<string, string> = {
  'entity.parse.failed': 'INVALID_JSON',
  'entity.too.large': 'PAYLOAD_TOO_LARGE',
};

function sendError(res: Response, statusCode: number, error: ApiErrorResponse['error']) {
  const body: ApiErrorResponse = { error };
  res.status(statusCode).json(body);
}

// Express 5 forwards errors thrown in async handlers here, so controllers can just `throw`.
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.statusCode, {
      code: err.code,
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
    });
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: formatZodError(err),
    });
    return;
  }

  if (isHttpError(err) && err.status >= 400 && err.status < 500) {
    sendError(res, err.status, {
      code: BODY_PARSER_ERROR_CODES[err.type ?? ''] ?? 'BAD_REQUEST',
      message: err.expose ? err.message : 'Bad request',
    });
    return;
  }

  console.error(err);
  sendError(res, 500, {
    code: 'INTERNAL_SERVER_ERROR',
    message: isProduction || !(err instanceof Error) ? 'Something went wrong' : err.message,
  });
};
