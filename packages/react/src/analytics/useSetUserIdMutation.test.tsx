import { act, renderHook, waitFor } from "@testing-library/react";
import type { Analytics } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import { setUserId } from "firebase/analytics";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { useSetUserIdMutation } from "./useSetUserIdMutation";

vi.mock("firebase/analytics", () => ({
  setUserId: vi.fn(),
}));

const mockAnalytics = {
  app: { name: "[DEFAULT]" } as FirebaseApp,
} as Analytics;

describe("useSetUserIdMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully sets a user id", async () => {
    const { result } = renderHook(() => useSetUserIdMutation(mockAnalytics), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ id: "user-123" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setUserId).toHaveBeenCalledWith(
      mockAnalytics,
      "user-123",
      undefined,
    );
  });

  test("successfully clears a user id", async () => {
    const { result } = renderHook(() => useSetUserIdMutation(mockAnalytics), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ id: null });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setUserId).toHaveBeenCalledWith(mockAnalytics, null, undefined);
  });

  test("passes analytics call options", async () => {
    const { result } = renderHook(() => useSetUserIdMutation(mockAnalytics), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ id: "user-123", callOptions: { global: true } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setUserId).toHaveBeenCalledWith(mockAnalytics, "user-123", {
      global: true,
    });
  });

  test("handles failure", async () => {
    const error = new Error("Failed to set user id");
    vi.mocked(setUserId).mockImplementationOnce(() => {
      throw error;
    });

    const { result } = renderHook(() => useSetUserIdMutation(mockAnalytics), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ id: "user-123" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
