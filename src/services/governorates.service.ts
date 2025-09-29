import api from "@/lib/utils/axios";
import { endpoints } from "../lib/api/endpoints";
import { Governorate, PaginatedResponse, QueryParams } from "@/types";

export const getGovernorates = async (
  params?: QueryParams
): Promise<PaginatedResponse<Governorate>> => {
  const { data } = await api.get(endpoints.governorates.getGovernorates, {
    params,
  });
  return data;
};

export const updateGovernorateStatus = async (
  id: number,
  isActive: boolean
): Promise<Governorate> => {
  const { data } = await api.patch(
    endpoints.governorates.updateGovernorate(id),
    {
      isActive,
    }
  );

  return data;
};
