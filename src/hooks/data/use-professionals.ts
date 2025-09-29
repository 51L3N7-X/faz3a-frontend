import { getProfessionals } from "@/services/professionals.service";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transformPaginatedResponse } from "../utils/transformResponse";
import api from "@/lib/utils/axios";
import { endpoints } from "@/lib/api/endpoints";
import {
  CreateProfessionalFormInput,
  UpdateProfessionalFormInput,
} from "@/lib/schemas/professionals";

export const useProfessionals = (params?: Partial<QueryParams>) => {
  const queryResult = useQuery({
    queryKey: ["professionals", params],
    queryFn: async () => {
      try {
        const response = await getProfessionals(params);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
  return transformPaginatedResponse(queryResult, "professionals");
};

export function useCreateProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProfessionalFormInput) => {
      const response = await api.post(
        endpoints.professionals.addProfessionals,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdateProfessionalFormInput & { id: number }) => {
      const response = await api.patch(
        endpoints.professionals.updateProfessional(id),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useDeleteProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        endpoints.professionals.deleteProfessional(id)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}
