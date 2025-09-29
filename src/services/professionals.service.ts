import api from "../lib/utils/axios";
import { endpoints } from "../lib/api/endpoints";
import { ApiResponse, PaginatedResponse, Professional, QueryParams } from "@/types";

export const getProfessionals = async (params?: Partial<QueryParams>): Promise<PaginatedResponse<Professional>> => {
  const { data } = await api.get(endpoints.professionals.getProfessionals, { params });
  return data;
};
