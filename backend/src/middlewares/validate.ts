import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import type { RequestLocation, ValidationIssue } from '../types/api.types.js';
import { AppError } from '../utils/AppError.js';
import { formatZodError } from '../utils/formatZodError.js';

type RequestSchemas = Partial<Record<RequestLocation, ZodType>>;

const LOCATIONS: RequestLocation[] = ['params', 'query', 'body'];

export function validate(schemas: RequestSchemas): RequestHandler {
  return (req, res, next) => {
    const issues: ValidationIssue[] = [];
    const validated: Express.Locals['validated'] = {};

    for (const location of LOCATIONS) {
      const schema = schemas[location];
      if (!schema) continue;

      const result = schema.safeParse(req[location]);
      if (result.success) {
        validated[location] = result.data;
      } else {
        issues.push(...formatZodError(result.error, location));
      }
    }

    if (issues.length > 0) {
      next(AppError.validation(issues));
      return;
    }

    res.locals.validated = validated;
    next();
  };
}
