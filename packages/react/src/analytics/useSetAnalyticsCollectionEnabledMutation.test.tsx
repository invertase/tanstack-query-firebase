import { act, renderHook, waitFor } from "@testing-library/react";
import type { Analytics } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import { setAnalyticsCollectionEnabled } from "firebase/analytics";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { useSetAnalyticsCollectionEnabledMutation } from "./useSetAnalyticsCollectionEnabledMutation";

vi.mock("firebase/analytics", () => ({
  setAnalyticsCollectionEnabled: vi.fn(),
}));

const mockAnalytics = {
  app: { name: "[DEFAULT]" } as FirebaseApp,
} as Analytics;

describe("useSetAnalyticsCollectionEnabledMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully enables analytics collection", async () => {
    const { result } = renderHook(
      () => useSetAnalyticsCollectionEnabledMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate(true);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setAnalyticsCollectionEnabled).toHaveBeenCalledWith(
      mockAnalytics,
      true,
    );
  });

  test("successfully disables analytics collection", async () => {
    const { result } = renderHook(
      () => useSetAnalyticsCollectionEnabledMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate(false);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setAnalyticsCollectionEnabled).toHaveBeenCalledWith(
      mockAnalytics,
      false,
    );
  });

  test("handles failure", async () => {
    const error = new Error("Failed to set collection enabled");
    vi.mocked(setAnalyticsCollectionEnabled).mockImplementationOnce(() => {
      throw error;
    });

    const { result } = renderHook(
      () => useSetAnalyticsCollectionEnabledMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate(true);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  test("calls onSuccess callback after successful update", async () => {
    const onSuccessMock = vi.fn();

    const { result } = renderHook(
      () =>
        useSetAnalyticsCollectionEnabledMutation(mockAnalytics, {
          onSuccess: onSuccessMock,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate(true);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessMock).toHaveBeenCalled();
  });
});
