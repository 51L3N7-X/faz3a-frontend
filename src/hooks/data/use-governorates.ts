import * as GovernoratesService from "@/services/governorates.service";
import { QueryParams } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transformPaginatedResponse } from "../utils/transformResponse";

export const useGovernorates = (params?: QueryParams) => {
  const queryResult = useQuery({
    queryKey: ["governorates", params],
    queryFn: async () => {
      try {
        const response = await GovernoratesService.getGovernorates(params);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

return transformPaginatedResponse(queryResult, "governorates");
};

export const useUpdateGovernorateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => {
      console.log("Mutation function called with:", { id, isActive });
      return GovernoratesService.updateGovernorateStatus(id, isActive);
    },
    onSuccess: (data) => {
      console.log("Mutation successful, invalidating queries:", data);
      // Invalidate and refetch governorates queries
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
    onError: (error) => {
      console.error("Failed to update governorate status:", error);
    },
  });
};
