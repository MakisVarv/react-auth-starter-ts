import apiClient from "../../../shared/api/apiClient";
import { getCookie } from "../../../shared/utils/cookies";
import type { User } from "../../users/types";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  UpdateProfileData,
} from "../types";

export async function login(
  credentials: LoginCredentials,
  signal?: AbortSignal,
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials,
    { signal },
  );

  return response.data;
}
export async function register(
  credentials: RegisterCredentials,
): Promise<User> {
  const response = await apiClient.post<User>("/auth/register", credentials);

  return response.data;
}
export async function logout(): Promise<void> {
  const csrfToken = getCookie("csrf_refresh_token");
  if (csrfToken == null) {
    return;
  }
  await apiClient.post(
    "/auth/logout",
    {},
    {
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    },
  );
}

export async function refresh(): Promise<string | null> {
  const csrfToken = getCookie("csrf_refresh_token");
  if (csrfToken == null) {
    return null;
  }
  const response = await apiClient.post(
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

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
}
export async function updateProfile(data: UpdateProfileData): Promise<User> {
  const response = await apiClient.patch<User>("/auth/me", data);
  return response.data;
}
export async function forgotPassword(email: string) {
  const response = await apiClient.post("/auth/forgot-password", { email });

  return response.data;
}
export async function resetPassword(token: string, newPassword: string) {
  const response = await apiClient.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });

  return response.data;
}
export async function changePassword(
  freshAccessToken: string,
  newPassword: string,
  signal?: AbortSignal,
) {
  const response = await apiClient.post(
    "/auth/change-password",
    {
      new_password: newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${freshAccessToken}`,
      },
      signal,
    },
  );

  return response.data;
}
export async function changeEmail(
  freshAccessToken: string,
  newEmail: string,
  signal?: AbortSignal,
) {
  const response = await apiClient.post(
    "/auth/change-email",
    {
      new_email: newEmail,
    },
    {
      headers: {
        Authorization: `Bearer ${freshAccessToken}`,
      },
      signal,
    },
  );

  return response.data;
}
export async function reauthenticate(
  currentPassword: string,
  signal?: AbortSignal,
): Promise<{ access_token: string }> {
  const response = await apiClient.post<{ access_token: string }>(
    "/auth/reauthenticate",
    {
      current_password: currentPassword,
    },
    {
      signal,
    },
  );

  return response.data;
}
export async function logoutAll(
  freshAccessToken: string,
  signal?: AbortSignal,
) {
  const response = await apiClient.post(
    "/auth/logout-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${freshAccessToken}`,
      },
      signal,
    },
  );

  return response.data;
}
