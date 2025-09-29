import { endpoints } from "@/lib/api/endpoints";
import api from "@/lib/utils/axios";
import { Candidate, PaginatedResponse, QueryParams } from "@/types";

export const getCandidates = async (params?: Partial<QueryParams>): Promise<PaginatedResponse<Candidate>> => {
  const { data } = await api.get(endpoints.candidates.getCandidates, { params });
  return data;
};
