import axios, { isAxiosError } from 'axios';

import type { ApiErrorResponse } from '../types/api';

export const api = axios.create({ baseURL: '/api' });

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response || [502, 503, 504].includes(error.response.status)) {
      return 'Cannot reach the server. Please make sure the API is running.';
    }
    if (error.response.data?.error?.message) {
      return error.response.data.error.message;
    }
  }
  return 'Something went wrong. Please try again.';
}

export function getFieldErrors(error: unknown): { name: string; errors: string[] }[] {
  if (!isAxiosError<ApiErrorResponse>(error)) return [];

  const errorsByField = new Map<string, string[]>();
  for (const issue of error.response?.data?.error?.details ?? []) {
    if (issue.location !== 'body' || !issue.field) continue;
    errorsByField.set(issue.field, [...(errorsByField.get(issue.field) ?? []), issue.message]);
  }

  return [...errorsByField].map(([name, errors]) => ({ name, errors }));
}
