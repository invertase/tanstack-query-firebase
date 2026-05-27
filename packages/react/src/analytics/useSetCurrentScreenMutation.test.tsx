import { act, renderHook, waitFor } from "@testing-library/react";
import type { Analytics } from "firebase/analytics";
import { setCurrentScreen } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { useSetCurrentScreenMutation } from "./useSetCurrentScreenMutation";

vi.mock("firebase/analytics", () => ({
  setCurrentScreen: vi.fn(),
}));

const mockAnalytics = {
  app: { name: "[DEFAULT]" } as FirebaseApp,
} as Analytics;

describe("useSetCurrentScreenMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully sets the current screen", async () => {
    const { result } = renderHook(
      () => useSetCurrentScreenMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ screenName: "Home" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setCurrentScreen).toHaveBeenCalledWith(
      mockAnalytics,
      "Home",
      undefined,
    );
  });

  test("passes analytics call options", async () => {
    const { result } = renderHook(
      () => useSetCurrentScreenMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({
        screenName: "Settings",
        callOptions: { global: true },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setCurrentScreen).toHaveBeenCalledWith(mockAnalytics, "Settings", {
      global: true,
    });
  });

  test("handles failure", async () => {
    const error = new Error("Failed to set current screen");
    vi.mocked(setCurrentScreen).mockImplementationOnce(() => {
      throw error;
    });

    const { result } = renderHook(
      () => useSetCurrentScreenMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ screenName: "Home" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
