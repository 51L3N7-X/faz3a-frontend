import Axios, { InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "./tokens";
import { BASE_URL } from "../api/endpoints";

export const api = Axios.create({
  baseURL: BASE_URL,
});

const authRequestInterceptor = (config: InternalAxiosRequestConfig<unknown>) => {
  if (config.headers) {
    config.headers["Content-Type"] = "application/json";
    config.headers["Timezone-Val"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    const token = getAccessToken();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
      config.withCredentials = true;
    }
  }
  return config;
};

api.interceptors.request.use(authRequestInterceptor);

export default api;
