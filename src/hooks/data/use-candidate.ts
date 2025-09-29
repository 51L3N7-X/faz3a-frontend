import { getProfessionals } from "@/services/professionals.service";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transformPaginatedResponse } from "../utils/transformResponse";
import api from "@/lib/utils/axios";
import { endpoints } from "@/lib/api/endpoints";
import {
  CreateCandidateFormInput,
  UpdateCandidateFormInput,
} from "@/lib/schemas/candidates";
import { getCandidates } from "@/services/candidates.service";

export const useCandidates = (params?: Partial<QueryParams>) => {
  const queryResult = useQuery({
    queryKey: ["candidates", params],
    queryFn: async () => {
      try {
        const response = await getCandidates(params);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
  return transformPaginatedResponse(queryResult, "candidates");
};

export function useCreateCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCandidateFormInput) => {
      const response = await api.post(
        endpoints.candidates.addCandidate,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdateCandidateFormInput & { id: number }) => {
      const response = await api.patch(
        endpoints.candidates.updateCandidate(id),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}

export function useDeleteCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        endpoints.candidates.deleteCandidate(id)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}
