import type { ZodError } from 'zod';

import type { ValidationIssue } from '../types/api.types.js';

export function formatZodError(error: ZodError, prefix?: string): ValidationIssue[] {
  return error.issues.map((issue) => ({
    field: [prefix, ...issue.path.map(String)].filter(Boolean).join('.'),
    message: issue.message,
  }));
}
