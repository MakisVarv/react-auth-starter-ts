import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { AuthProvider } from "../features/auth/context/AuthProvider";
import { useAuth } from "../features/auth/hooks/useAuth";

import {
  clearAccessToken,
  getAccessToken,
} from "../shared/api/accessTokenStore";

import { notifySessionExpired } from "../shared/api/sessionEvents";

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

function TestConsumer() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <p>Loading...</p>;
  }

  return <p>{user ? user.email : "Unauthenticated"}</p>;
}

afterEach(() => {
  clearAccessToken();
  vi.resetAllMocks();
});

it("restores the authenticated user when refresh succeeds", async () => {
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

it("clears the authenticated session when session expiration is notified", async () => {
  mockRefresh.mockResolvedValue("restored-token");
  mockGetCurrentUser.mockResolvedValue(mockUser);

  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );

  // First, establish an authenticated session.
  expect(await screen.findByText("test@example.com")).toBeInTheDocument();
  expect(getAccessToken()).toBe("restored-token");

  // Simulate the session-expiration event emitted by the API client.
  act(() => {
    notifySessionExpired();
  });

  // Authentication state and token must both be cleared.
  expect(screen.getByText("Unauthenticated")).toBeInTheDocument();
  expect(getAccessToken()).toBeNull();
});
