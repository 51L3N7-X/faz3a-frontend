import { type PaginatedResponse } from "@/types/api.types";
import { type UseQueryResult } from "@tanstack/react-query";

// Accept a `dataKey` parameter to customize the property name with proper typing
export const transformPaginatedResponse = <T, K extends string>(
  queryResult: UseQueryResult<PaginatedResponse<T>, Error>,
  dataKey: K // e.g., 'governorates', 'users', 'products'
): UseQueryResult<PaginatedResponse<T>, Error> & 
   Record<K, T[]> & {
     totalItems: number;
     totalPages: number;
     currentPage: number;
     hasNext: boolean;
     hasPrevious: boolean;
   } => {
  const { data, ...queryRest } = queryResult;

  // Use computed property names to create the dynamic key
  return {
    ...queryRest,
    [dataKey]: data?.data || [], // This creates a property named whatever `dataKey` is
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPages || 1,
    currentPage: data?.currentPage || 1,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
  } as UseQueryResult<PaginatedResponse<T>, Error> & 
     Record<K, T[]> & {
       totalItems: number;
       totalPages: number;
       currentPage: number;
       hasNext: boolean;
       hasPrevious: boolean;
     };
};
