import { act, renderHook, waitFor } from "@testing-library/react";
import { setConsent } from "firebase/analytics";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { useSetConsentMutation } from "./useSetConsentMutation";

vi.mock("firebase/analytics", () => ({
  setConsent: vi.fn(),
}));

describe("useSetConsentMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully sets consent settings", async () => {
    const consentSettings = {
      analytics_storage: "granted" as const,
      ad_storage: "denied" as const,
    };

    const { result } = renderHook(() => useSetConsentMutation(), { wrapper });

    await act(async () => {
      result.current.mutate(consentSettings);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setConsent).toHaveBeenCalledWith(consentSettings);
  });

  test("handles failure", async () => {
    const error = new Error("Failed to set consent");
    vi.mocked(setConsent).mockImplementationOnce(() => {
      throw error;
    });

    const { result } = renderHook(() => useSetConsentMutation(), { wrapper });

    await act(async () => {
      result.current.mutate({ analytics_storage: "granted" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  test("calls onSuccess callback after successful update", async () => {
    const onSuccessMock = vi.fn();

    const { result } = renderHook(
      () => useSetConsentMutation({ onSuccess: onSuccessMock }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ analytics_storage: "granted" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessMock).toHaveBeenCalled();
  });
});
