import { CreateSubCategoryFormInput } from "@/lib/schemas/category";
import { endpoints } from "@/lib/api/endpoints";
import api from "@/lib/utils/axios";
import {
  MainCategoriesQueryParams,
  MainCategory,
  PaginatedResponse,
  QueryParams,
  SubCategory,
} from "@/types";

export const getMainCategories = async (
  params?: MainCategoriesQueryParams
): Promise<PaginatedResponse<MainCategory>> => {
  const { data } = await api.get(endpoints.categories.getMainCategories, {
    params,
  });
  return data;
};

export const getSubCategories = async (
  parentId: number,
  params?: QueryParams
): Promise<PaginatedResponse<SubCategory>> => {
  const { data } = await api.get(
    endpoints.categories.getSubCategories(parentId),
    { params }
  );
  return data;
};

export const getCategory = async (
  id: number
): Promise<MainCategory> => {
  const { data } = await api.get(endpoints.categories.updateCategory(id));
  return data;
};

export const createSubCategory = async (
  data: CreateSubCategoryFormInput,
  parentId: number
): Promise<SubCategory> => {
  const { data: resData } = await api.post(endpoints.categories.addCategory, {
    ...data,
    parentId,
  });
  return resData;
};

export const updateSubCategory = async (
  id: number,
  data: CreateSubCategoryFormInput
): Promise<SubCategory> => {
  const { data: resData } = await api.patch(endpoints.categories.updateCategory(id), data);
  return resData;
};
