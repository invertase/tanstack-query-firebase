import { act, renderHook, waitFor } from "@testing-library/react";
import type { Analytics } from "firebase/analytics";
import { setUserProperties } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { useSetUserPropertiesMutation } from "./useSetUserPropertiesMutation";

vi.mock("firebase/analytics", () => ({
  setUserProperties: vi.fn(),
}));

const mockAnalytics = {
  app: { name: "[DEFAULT]" } as FirebaseApp,
} as Analytics;

describe("useSetUserPropertiesMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully sets user properties", async () => {
    const properties = { favorite_food: "pizza", plan: "premium" };

    const { result } = renderHook(
      () => useSetUserPropertiesMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ properties });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setUserProperties).toHaveBeenCalledWith(
      mockAnalytics,
      properties,
      undefined,
    );
  });

  test("passes analytics call options", async () => {
    const properties = { role: "admin" };

    const { result } = renderHook(
      () => useSetUserPropertiesMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ properties, callOptions: { global: true } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setUserProperties).toHaveBeenCalledWith(mockAnalytics, properties, {
      global: true,
    });
  });

  test("handles failure", async () => {
    const error = new Error("Failed to set user properties");
    vi.mocked(setUserProperties).mockImplementationOnce(() => {
      throw error;
    });

    const { result } = renderHook(
      () => useSetUserPropertiesMutation(mockAnalytics),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ properties: { role: "admin" } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
