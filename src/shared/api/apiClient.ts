import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import apiUrl from "../../config/env";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./accessTokenStore";
import { AppError } from "./errors";
import { refreshAccessToken } from "./tokenRefresh";
import { notifySessionExpired } from "./sessionEvents";
let refreshPromise: Promise<string | null> | null = null;
interface ApiRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _usesManagedAccessToken?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

function getFirstValidationError(
  errors: Record<string, string[]> | null,
): string | null {
  if (errors === null) return null;

  for (const messages of Object.values(errors)) {
    if (messages.length > 0) {
      return messages[0];
    }
  }

  return null;
}

apiClient.interceptors.request.use((config: ApiRequestConfig) => {
  const token = getAccessToken();

  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
    config._usesManagedAccessToken = true;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isCancel(error)) {
      throw error;
    }
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    const status = error.response?.status ?? null;
    const errors = error.response?.data?.errors ?? null;
    const code = error.response?.data?.code ?? null;
    const originalRequest: ApiRequestConfig | undefined = error.config;
    const shouldAttemptRefresh =
      status === 401 &&
      code === "access_token_expired" &&
      originalRequest &&
      originalRequest._usesManagedAccessToken &&
      !originalRequest._retry;
    if (shouldAttemptRefresh) {
      originalRequest._retry = true;

      if (refreshPromise === null) {
        refreshPromise = refreshAccessToken();
      }
      const activeRefresh = refreshPromise;
      try {
        const newAccessToken = await activeRefresh;
        if (newAccessToken !== null) {
          setAccessToken(newAccessToken);
          originalRequest.headers.delete("Authorization");
          return apiClient(originalRequest);
        } else {
          clearAccessToken();
          notifySessionExpired();
        }
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const refreshStatus = refreshError.response?.status ?? null;
          if (refreshStatus === 401) {
            clearAccessToken();
            notifySessionExpired();
          }
          const refreshErrors = refreshError.response?.data?.errors ?? null;
          const refreshMessage =
            getFirstValidationError(refreshErrors) ??
            refreshError.response?.data?.message ??
            (refreshError.response
              ? "Request failed. Please try again."
              : "Unable to connect to the server.");
          throw new AppError(refreshMessage, refreshStatus, refreshErrors);
        }
        throw refreshError;
      } finally {
        if (refreshPromise === activeRefresh) {
          refreshPromise = null;
        }
      }
    }
    const message =
      getFirstValidationError(errors) ??
      error.response?.data?.message ??
      (error.response
        ? "Request failed. Please try again."
        : "Unable to connect to the server.");
    throw new AppError(message, status, errors);
  },
);
export default apiClient;
