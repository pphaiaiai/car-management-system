export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ValidationIssue {
  field: string;
  message: string;
}
