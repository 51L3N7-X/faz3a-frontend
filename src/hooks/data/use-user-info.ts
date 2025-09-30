import { useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { endpoints } from "@/lib/api/endpoints";
import { User } from "@/types/domain.types";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        const response = await api.get<User>(endpoints.auth.me);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        throw error;
      }
    },
  });
};
