import { act, renderHook, waitFor } from "@testing-library/react";
import { setDefaultEventParameters } from "firebase/analytics";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { useSetDefaultEventParametersMutation } from "./useSetDefaultEventParametersMutation";

vi.mock("firebase/analytics", () => ({
  setDefaultEventParameters: vi.fn(),
}));

describe("useSetDefaultEventParametersMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("successfully sets default event parameters", async () => {
    const customParams = { session_id: "abc123", debug_mode: true };

    const { result } = renderHook(
      () => useSetDefaultEventParametersMutation(),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate(customParams);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setDefaultEventParameters).toHaveBeenCalledWith(customParams);
  });

  test("handles failure", async () => {
    const error = new Error("Failed to set default event parameters");
    vi.mocked(setDefaultEventParameters).mockImplementationOnce(() => {
      throw error;
    });

    const { result } = renderHook(
      () => useSetDefaultEventParametersMutation(),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ session_id: "abc123" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  test("calls onSuccess callback after successful update", async () => {
    const onSuccessMock = vi.fn();

    const { result } = renderHook(
      () => useSetDefaultEventParametersMutation({ onSuccess: onSuccessMock }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ session_id: "abc123" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessMock).toHaveBeenCalled();
  });
});
