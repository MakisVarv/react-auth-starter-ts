import type { User } from "../users/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string | null;
}
export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  phone: string | null;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthContextValue {
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  user: User | null;
  isAuthLoading: boolean;
  login: (credentials: LoginCredentials, signal?: AbortSignal) => Promise<User>;
  logout: () => Promise<void>;
  clearSession: () => void;
}
