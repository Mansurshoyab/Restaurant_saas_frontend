// Matches src/common/utils/apiResponse.js on the backend exactly.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Matches src/middleware/errorHandler.middleware.js's error shape.
export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: Record<string, string[]>; // zod field errors
  stack?: string; // only present outside production
}

export interface ListParams {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}


