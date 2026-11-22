import type { ZodError } from 'zod';

import type { RequestLocation, ValidationIssue } from '../types/api.types.js';

export function formatZodError(error: ZodError, location?: RequestLocation): ValidationIssue[] {
  return error.issues.map((issue) => ({
    ...(location && { location }),
    field: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}
