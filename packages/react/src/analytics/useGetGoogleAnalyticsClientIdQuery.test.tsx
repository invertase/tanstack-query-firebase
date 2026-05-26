import { renderHook, waitFor } from "@testing-library/react";
import type { Analytics } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import { getGoogleAnalyticsClientId } from "firebase/analytics";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { analyticsQueryKeys } from "./queryKeys";
import { useGetGoogleAnalyticsClientIdQuery } from "./useGetGoogleAnalyticsClientIdQuery";

vi.mock("firebase/analytics", () => ({
  getGoogleAnalyticsClientId: vi.fn(),
}));

const mockAnalytics = {
  app: { name: "[DEFAULT]" } as FirebaseApp,
} as Analytics;

describe("useGetGoogleAnalyticsClientIdQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully retrieves a Google Analytics client id", async () => {
    vi.mocked(getGoogleAnalyticsClientId).mockResolvedValueOnce("client-123");

    const { result } = renderHook(
      () =>
        useGetGoogleAnalyticsClientIdQuery(mockAnalytics, {
          queryKey: analyticsQueryKeys.googleAnalyticsClientId(
            mockAnalytics.app.name,
          ),
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe("client-123");
    expect(getGoogleAnalyticsClientId).toHaveBeenCalledWith(mockAnalytics);
  });

  test("handles retrieval failure", async () => {
    const error = new Error("Failed to get client id");
    vi.mocked(getGoogleAnalyticsClientId).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () =>
        useGetGoogleAnalyticsClientIdQuery(mockAnalytics, {
          queryKey: analyticsQueryKeys.googleAnalyticsClientId(
            mockAnalytics.app.name,
          ),
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  test("respects enabled option", async () => {
    const { result } = renderHook(
      () =>
        useGetGoogleAnalyticsClientIdQuery(mockAnalytics, {
          queryKey: analyticsQueryKeys.googleAnalyticsClientId(
            mockAnalytics.app.name,
          ),
          enabled: false,
        }),
      { wrapper },
    );

    expect(result.current.status).toBe("pending");
    expect(getGoogleAnalyticsClientId).not.toHaveBeenCalled();
  });
});
