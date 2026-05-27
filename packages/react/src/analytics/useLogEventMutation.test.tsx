import { act, renderHook, waitFor } from "@testing-library/react";
import type { Analytics } from "firebase/analytics";
import { logEvent } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { useLogEventMutation } from "./useLogEventMutation";

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

const mockAnalytics = {
  app: { name: "[DEFAULT]" } as FirebaseApp,
} as Analytics;

describe("useLogEventMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully logs an event", async () => {
    const { result } = renderHook(() => useLogEventMutation(mockAnalytics), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        eventName: "login",
        eventParams: { method: "email" },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(logEvent).toHaveBeenCalledWith(
      mockAnalytics,
      "login",
      {
        method: "email",
      },
      undefined,
    );
  });

  test("passes analytics call options", async () => {
    const { result } = renderHook(() => useLogEventMutation(mockAnalytics), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        eventName: "page_view",
        eventParams: { page_title: "Home" },
        callOptions: { global: true },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(logEvent).toHaveBeenCalledWith(
      mockAnalytics,
      "page_view",
      { page_title: "Home" },
      { global: true },
    );
  });

  test("handles log event failure", async () => {
    const error = new Error("Failed to log event");
    vi.mocked(logEvent).mockImplementationOnce(() => {
      throw error;
    });

    const { result } = renderHook(() => useLogEventMutation(mockAnalytics), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ eventName: "login" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  test("calls onSuccess callback after successful log", async () => {
    const onSuccessMock = vi.fn();

    const { result } = renderHook(
      () => useLogEventMutation(mockAnalytics, { onSuccess: onSuccessMock }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ eventName: "sign_up" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessMock).toHaveBeenCalled();
  });
});
