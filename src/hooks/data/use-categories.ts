import { MainCategoriesQueryParams, QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transformPaginatedResponse } from "../utils/transformResponse";
import {
  getMainCategories,
  getCategory,
  getSubCategories,
  updateSubCategory,
  createSubCategory,
} from "@/services/categories.service";
import { endpoints } from "@/lib/api/endpoints";
import api from "@/lib/utils/axios";

export interface CreateCategoryInput {
  nameEn: string;
  nameAr: string;
  type: "SERVICE" | "JOB";
  isActive: boolean;
}

export const useMainCategories = (
  params?: Partial<MainCategoriesQueryParams>
) => {
  const queryResult = useQuery({
    queryKey: ["mainCategories", params],
    queryFn: async () => {
      try {
        const response = await getMainCategories(params);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  return transformPaginatedResponse(queryResult, "mainCategories");
};

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await api.post(endpoints.categories.addCategory, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mainCategories"] });
    },
  });
}

export function useUpdateCategory(categoryId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await api.patch(
        endpoints.categories.updateCategory(Number(categoryId)),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mainCategories"] });
      if (onSuccess) onSuccess();
    },
  });
}

/** Sub Categories */

export const useSubCategories = (parentId: number, params?: QueryParams) => {
  const queryResult = useQuery({
    queryKey: ["subCategories", parentId, params],
    queryFn: async () => {
      try {
        return await getSubCategories(parentId, params);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!parentId,
  });

  return transformPaginatedResponse(queryResult, "subCategories");
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
};

export function useDeleteCategory(isSubcategory = false, parentId?: number) {
  const queryClient = useQueryClient();
  const { refetch } = useMainCategories();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        endpoints.categories.deleteCategory(id)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mainCategories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
      
      if (isSubcategory && parentId) {
        queryClient.invalidateQueries({ 
          queryKey: ["subCategories", parentId] 
        });
      }
      
      refetch();
    },
  });
}

export const useCreateSubCategory = (parentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      parentId,
    }: {
      data: CreateCategoryInput;
      parentId: number;
    }) => createSubCategory(data, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subCategories", parentId],
      });
    },
  });
};

export const useUpdateSubCategory = (id: string, parentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      updateSubCategory(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subCategories", Number(parentId)],
      });
    },
  });
};
