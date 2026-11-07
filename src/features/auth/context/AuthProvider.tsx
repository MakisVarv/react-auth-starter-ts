import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";
import {
  login as loginRequest,
  logout as logoutRequest,
  updateProfile as updateProfileRequest,
  refresh,
  getCurrentUser,
} from "../services/authService";
import {
  setAccessToken,
  clearAccessToken,
} from "../../../shared/api/accessTokenStore";
import { subscribeToSessionExpired } from "../../../shared/api/sessionEvents";
import type {
  AuthContextValue,
  LoginCredentials,
  UpdateProfileData,
} from "../types";
import type { User } from "../../users/types";
interface AuthProviderProps {
  children: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const hasRestoredSession = useRef(false);

  const clearSession = useCallback(() => {
    setUser(null);
    clearAccessToken();
  }, []);
  useEffect(() => {
    return subscribeToSessionExpired(clearSession);
  }, [clearSession]);
  useEffect(() => {
    if (hasRestoredSession.current) {
      return;
    }
    hasRestoredSession.current = true;
    async function restoreSession() {
      setIsAuthLoading(true);
      try {
        const token = await refresh();

        if (!token) {
          clearAccessToken();
          return;
        }

        setAccessToken(token);

        const user = await getCurrentUser();

        setUser(user);
      } catch {
        setUser(null);
        clearAccessToken();
      } finally {
        setIsAuthLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(
    credentials: LoginCredentials,
    signal?: AbortSignal,
  ): Promise<User> {
    const data = await loginRequest(credentials, signal);

    setAccessToken(data.access_token);
    setUser(data.user);

    return data.user;
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }
  async function updateProfile(data: UpdateProfileData): Promise<User> {
    const updatedUser = await updateProfileRequest(data);

    setUser(updatedUser);

    return updatedUser;
  }

  const value: AuthContextValue = {
    user,
    isAuthLoading,
    updateProfile,
    login,
    logout,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
