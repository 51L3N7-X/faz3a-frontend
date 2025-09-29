import { endpoints, BASE_URL } from "../lib/api/endpoints";
import axios from "axios";
import api from "@/lib/utils/axios";

export interface IRefreshTokenResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  refreshToken: string;
}

export const refreshToken = async (refreshToken: string) => {
  const { data } = await axios.post<IRefreshTokenResponse>(
    `${BASE_URL}${endpoints.auth.refresh}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  return data;
};

export const login = async (payload: ILoginPayload) => {
  const { data } = await api.post<ILoginResponse>(
    endpoints.auth.login,
    payload
  );
  return data;
};
