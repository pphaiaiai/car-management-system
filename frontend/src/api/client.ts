import axios, { isAxiosError } from 'axios';

import type { ApiErrorResponse } from '../types/api';

export const api = axios.create({ baseURL: '/api' });

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Please make sure the API is running.';
    }
    if (error.response.data?.error?.message) {
      return error.response.data.error.message;
    }
  }
  return 'Something went wrong. Please try again.';
}
