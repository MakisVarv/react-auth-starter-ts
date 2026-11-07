import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { AuthProvider } from "../features/auth/context/AuthProvider";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  clearAccessToken,
  getAccessToken,
} from "../shared/api/accessTokenStore";

import type { User } from "../features/users/types";

const { mockRefresh, mockGetCurrentUser } = vi.hoisted(() => ({
  mockRefresh: vi.fn<() => Promise<string | null>>(),
  mockGetCurrentUser: vi.fn<() => Promise<User>>(),
}));

vi.mock("../features/auth/services/authService", () => ({
  refresh: mockRefresh,
  getCurrentUser: mockGetCurrentUser,
  login: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
}));

function TestConsumer() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <p>Loading...</p>;
  }

  return <p>{user ? user.email : "Unauthenticated"}</p>;
}

afterEach(() => {
  clearAccessToken();
  vi.clearAllMocks();
});

it("restores the authenticated user when refresh succeeds", async () => {
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    phone: null,
    is_active: true,
    role: {
      id: "1",
      name: "User",
      description: "Standard user",
      level: 10,
      permissions: [],
    },
  };

  mockRefresh.mockResolvedValue("restored-token");
  mockGetCurrentUser.mockResolvedValue(mockUser);

  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  expect(await screen.findByText("test@example.com")).toBeInTheDocument();

  expect(mockRefresh).toHaveBeenCalledTimes(1);
  expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
  expect(getAccessToken()).toBe("restored-token");
});
