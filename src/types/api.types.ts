import { AxiosError } from "axios";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Request/Parameter Types
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: unknown; // for filters
}

export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string>;
};

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    "message" in error &&
    typeof error.message === "string"
  );
}

export function normalizeApiError(error: unknown): ApiError {
  // Handle Axios errors
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{message?: string, errors?: Record<string, string>}>;
    return {
      status: axiosError.response?.status || 500,
      message: axiosError.response?.data?.message || axiosError.message || 'Request failed',
      errors: axiosError.response?.data?.errors
    };
  }
  
  // Handle other error formats
  if (isApiError(error)) {
    return error;
  }
  
  // Fallback for unknown errors
  return {
    status: 500,
    message: 'Unknown error occurred'
  };
}

/**
 * Query params specific to Main Categories API endpoints
 */

export interface MainCategoriesQueryParams extends QueryParams {
  type?: 'SERVICE' | 'JOB';
  isActive?: boolean;
}

export interface SubCategory {
  id: number;
  name: string;
  nameEn: string;
  nameAr: string;
  type: "SERVICE" | "JOB";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}