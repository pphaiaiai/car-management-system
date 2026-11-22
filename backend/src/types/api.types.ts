export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type RequestLocation = 'params' | 'query' | 'body';

export interface ValidationIssue {
  location?: RequestLocation;
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
