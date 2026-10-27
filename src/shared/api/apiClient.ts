import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import apiUrl from "../../config/env";
import { getAccessToken } from "./accessTokenStore";
import { AppError } from "./errors";

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) {
      throw error;
    }
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    const status = error.response?.status ?? null;
    const message =
      error.response?.data?.message ??
      (error.response
        ? "Request failed. Please try again."
        : "Unable to connect to the server.");
    throw new AppError(message, status);
  },
);
export default apiClient;
