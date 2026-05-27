import { renderHook, waitFor } from "@testing-library/react";
import { isSupported } from "firebase/analytics";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { queryClient, wrapper } from "../../utils";
import { analyticsQueryKeys } from "./queryKeys";
import { useIsSupportedQuery } from "./useIsSupportedQuery";

vi.mock("firebase/analytics", () => ({
  isSupported: vi.fn(),
}));

describe("useIsSupportedQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("returns true when analytics is supported", async () => {
    vi.mocked(isSupported).mockResolvedValueOnce(true);

    const { result } = renderHook(
      () =>
        useIsSupportedQuery({
          queryKey: analyticsQueryKeys.isSupported(),
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(true);
    expect(isSupported).toHaveBeenCalledTimes(1);
  });

  test("returns false when analytics is not supported", async () => {
    vi.mocked(isSupported).mockResolvedValueOnce(false);

    const { result } = renderHook(
      () =>
        useIsSupportedQuery({
          queryKey: analyticsQueryKeys.isSupported(),
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(false);
  });

  test("handles check failure", async () => {
    const error = new Error("Support check failed");
    vi.mocked(isSupported).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () =>
        useIsSupportedQuery({
          queryKey: analyticsQueryKeys.isSupported(),
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  test("respects enabled option", async () => {
    const { result } = renderHook(
      () =>
        useIsSupportedQuery({
          queryKey: analyticsQueryKeys.isSupported(),
          enabled: false,
        }),
      { wrapper },
    );

    expect(result.current.status).toBe("pending");
    expect(isSupported).not.toHaveBeenCalled();
  });
});
