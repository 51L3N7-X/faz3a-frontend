import { MainCategoriesQueryParams, QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transformPaginatedResponse } from "../utils/transformResponse";
import {
  getMainCategories,
  getCategory,
  getCategoryById,
  getSubCategories,
  getSubSubCategories,
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

export function useDeleteCategory(isSubcategory = false, parentId?: number, isLevel2 = false) {
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
        if (isLevel2) {
          // For Level 2 (Job Positions), invalidate subSubCategories
          queryClient.invalidateQueries({ 
            queryKey: ["subSubCategories", parentId] 
          });
        } else {
          // For Level 1 (Departments), invalidate subCategories
          queryClient.invalidateQueries({ 
            queryKey: ["subCategories", parentId] 
          });
        }
      }
      
      refetch();
    },
  });
}

export const useCreateSubCategory = (parentId: number, isLevel2 = false) => {
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
      if (isLevel2) {
        // For Level 2 (Job Positions), invalidate subSubCategories
        queryClient.invalidateQueries({
          queryKey: ["subSubCategories", parentId],
        });
      } else {
        // For Level 1 (Departments), invalidate subCategories
        queryClient.invalidateQueries({
          queryKey: ["subCategories", parentId],
        });
      }
    },
  });
};

export const useUpdateSubCategory = (id: string, parentId: string, isLevel2 = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      updateSubCategory(Number(id), data),
    onSuccess: () => {
      if (isLevel2) {
        // For Level 2 (Job Positions), invalidate subSubCategories
        queryClient.invalidateQueries({
          queryKey: ["subSubCategories", Number(parentId)],
        });
      } else {
        // For Level 1 (Departments), invalidate subCategories
        queryClient.invalidateQueries({
          queryKey: ["subCategories", Number(parentId)],
        });
      }
    },
  });
};

/** Sub-Sub Categories (Level 2 - Job Positions) */
export const useSubSubCategories = (parentId: number, params?: QueryParams) => {
  const queryResult = useQuery({
    queryKey: ["subSubCategories", parentId, params],
    queryFn: async () => {
      try {
        return await getSubSubCategories(parentId, params);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!parentId,
  });

  return transformPaginatedResponse(queryResult, "subSubCategories");
};

/**
 * Given a leaf-level job-position category ID, walk up two levels:
 *   jobPosition (level 2) → department/subCategory (level 1) → mainCategory (level 0)
 *
 * Returns { subCategoryId, mainCategoryId } so the edit dialog can
 * pre-populate all three cascade selects automatically, even for candidates
 * whose parentCategoryId / subCategoryId are not stored on the profile.
 */
export const useCategoryHierarchy = (leafCategoryId: number | null) => {
  // Fetch the leaf category (job position) to get its parentId (= department)
  const { data: jobPosition, isLoading: isLoadingJobPosition } = useQuery({
    queryKey: ["category", leafCategoryId],
    queryFn: () => getCategoryById(leafCategoryId!),
    enabled: !!leafCategoryId,
  });

  const subCategoryId = jobPosition?.parentId ?? null;

  // Fetch the department to get its parentId (= main category)
  const { data: department, isLoading: isLoadingDepartment } = useQuery({
    queryKey: ["category", subCategoryId],
    queryFn: () => getCategoryById(subCategoryId!),
    enabled: !!subCategoryId,
  });

  const mainCategoryId = department?.parentId ?? null;

  return {
    subCategoryId,
    mainCategoryId,
    isLoading: isLoadingJobPosition || isLoadingDepartment,
  };
};
