import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it } from "vitest";
import { AxiosError, CanceledError } from "axios";
import { AppError } from "./errors";
import apiClient from "./apiClient";
import { clearAccessToken, setAccessToken } from "./accessTokenStore";

// Simulate a successful HTTP response without contacting a backend.
const mockAdapter: AxiosAdapter = (config: InternalAxiosRequestConfig) => {
  return Promise.resolve({
    data: null,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });
};

afterEach((): void => {
  clearAccessToken();
});

describe("API Client Request Interceptor", () => {
  it("attaches the managed access token", async () => {
    setAccessToken("abc123");

    const response = await apiClient.get("/test", {
      adapter: mockAdapter,
    });

    expect(response.config.headers.get("Authorization")).toBe("Bearer abc123");
  });

  it("does not attach authorization when no token exists", async () => {
    clearAccessToken();

    const response = await apiClient.get("/test", {
      adapter: mockAdapter,
    });

    expect(response.config.headers.has("Authorization")).toBe(false);
  });

  it("preserves an explicitly provided Authorization header", async () => {
    setAccessToken("abc123");

    const response = await apiClient.get("/test", {
      adapter: mockAdapter,
      headers: {
        Authorization: "Bearer custom-token",
      },
    });

    expect(response.config.headers.get("Authorization")).toBe(
      "Bearer custom-token",
    );
  });
  it("normalizes network errors into AppError", async () => {
    const adapter: AxiosAdapter = (config) => {
      return Promise.reject(
        new AxiosError("Network Error", "ERR_NETWORK", config),
      );
    };

    const request = apiClient.get("/test", { adapter });

    await expect(request).rejects.toBeInstanceOf(AppError);

    await expect(request).rejects.toMatchObject({
      message: "Unable to connect to the server.",
      status: null,
    });
  });
  it("preserves request cancellation errors", async () => {
    const adapter: AxiosAdapter = (config) => {
      return Promise.reject(new CanceledError("Request cancelled", config));
    };

    const request = apiClient.get("/test", { adapter });

    await expect(request).rejects.toBeInstanceOf(CanceledError);
    await expect(request).rejects.not.toBeInstanceOf(AppError);
  });
  it("returns successful responses unchanged", async () => {
    const adapter: AxiosAdapter = (config) => {
      return Promise.resolve({
        data: { message: "Success" },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    };

    const response = await apiClient.get("/test", { adapter });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: "Success" });
  });
});
