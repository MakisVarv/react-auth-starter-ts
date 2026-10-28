import { AxiosError, type AxiosAdapter } from "axios";
import { afterEach, expect, it, vi } from "vitest";
import apiClient from "../shared/api/apiClient";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../shared/api/accessTokenStore";

const { mockRefresh } = vi.hoisted(() => ({
  mockRefresh: vi.fn<() => Promise<string | null>>(),
}));

vi.mock("../shared/api/tokenRefresh", () => ({
  refreshAccessToken: mockRefresh,
}));

afterEach((): void => {
  clearAccessToken();
  vi.clearAllMocks();
});

it("refreshes an expired access token and retries the original request", async () => {
  setAccessToken("expired-token");
  mockRefresh.mockResolvedValue("new-token");

  let attempts = 0;

  const adapter: AxiosAdapter = (config) => {
    attempts++;

    if (attempts === 1) {
      const response = {
        data: { code: "access_token_expired" },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
      };

      return Promise.reject(
        new AxiosError(
          "Access token expired",
          "ERR_BAD_REQUEST",
          config,
          undefined,
          response,
        ),
      );
    }

    expect(config.headers.get("Authorization")).toBe("Bearer new-token");

    return Promise.resolve({
      data: { success: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  };

  const response = await apiClient.get("/test", { adapter });

  expect(response.status).toBe(200);
  expect(attempts).toBe(2);
  expect(mockRefresh).toHaveBeenCalledTimes(1);
  expect(getAccessToken()).toBe("new-token");
});
