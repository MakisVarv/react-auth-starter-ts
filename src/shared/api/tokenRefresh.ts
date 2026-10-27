import axios, { type AxiosInstance } from "axios";
import { getCookie } from "../utils/cookies";
import apiUrl from "../../config/env";

interface RefreshTokenResponse {
  access_token: string;
}

const refreshClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export async function refreshAccessToken(): Promise<string | null> {
  const csrfToken = getCookie("csrf_refresh_token");

  if (csrfToken == null) {
    return null;
  }

  const response = await refreshClient.post<RefreshTokenResponse>(
    "/auth/refresh",
    {},
    {
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    },
  );

  return response.data.access_token;
}
