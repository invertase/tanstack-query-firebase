import { act, renderHook, waitFor } from "@testing-library/react";
import { type Auth, revokeAccessToken } from "firebase/auth";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { expectInitialMutationState, queryClient, wrapper } from "../../utils";
import { useRevokeAccessTokenMutation } from "./useRevokeAccessTokenMutation";

vi.mock("firebase/auth", () => ({
  ...vi.importActual("firebase/auth"),
  revokeAccessToken: vi.fn(),
}));

describe("useRevokeAccessTokenMutation", () => {
  const mockAuth = {} as Auth;
  const mockToken = "mock-access-token";

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("should successfully revoke access token", async () => {
    vi.mocked(revokeAccessToken).mockResolvedValueOnce(undefined);

    const { result } = renderHook(
      () => useRevokeAccessTokenMutation(mockAuth),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate(mockToken);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(revokeAccessToken).toHaveBeenCalledTimes(1);
    expect(revokeAccessToken).toHaveBeenCalledWith(mockAuth, mockToken);
  });

  test("should handle revocation failure", async () => {
    const mockError = new Error("Failed to revoke token");
    vi.mocked(revokeAccessToken).mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => useRevokeAccessTokenMutation(mockAuth),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate(mockToken);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(revokeAccessToken).toHaveBeenCalledTimes(1);
    expect(revokeAccessToken).toHaveBeenCalledWith(mockAuth, mockToken);
  });

  test("should accept and use custom mutation options", async () => {
    vi.mocked(revokeAccessToken).mockResolvedValueOnce(undefined);

    const onSuccessMock = vi.fn();
    const onErrorMock = vi.fn();

    const { result } = renderHook(
      () =>
        useRevokeAccessTokenMutation(mockAuth, {
          onSuccess: onSuccessMock,
          onError: onErrorMock,
        }),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate(mockToken);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).not.toHaveBeenCalled();
  });

  test("should properly handle loading state throughout mutation lifecycle", async () => {
    vi.mocked(revokeAccessToken).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    const { result } = renderHook(
      () => useRevokeAccessTokenMutation(mockAuth),
      {
        wrapper,
      },
    );

    expect(result.current.isPending).toBe(false);
    expect(result.current.isIdle).toBe(true);

    await act(async () => {
      await result.current.mutateAsync(mockToken);
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isIdle).toBe(false);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isIdle).toBe(false);
  });

  test("should handle multiple sequential mutations correctly", async () => {
    vi.mocked(revokeAccessToken).mockResolvedValueOnce(undefined);

    const { result } = renderHook(
      () => useRevokeAccessTokenMutation(mockAuth),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate(mockToken);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Reset mock
    vi.mocked(revokeAccessToken).mockResolvedValueOnce(undefined);

    act(() => {
      result.current.mutate("different-token");
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(revokeAccessToken).toHaveBeenCalledTimes(2);
    expect(revokeAccessToken).toHaveBeenLastCalledWith(
      mockAuth,
      "different-token",
    );
  });

  test("should reset mutation state correctly", async () => {
    vi.mocked(revokeAccessToken).mockResolvedValueOnce(undefined);

    const { result } = renderHook(
      () => useRevokeAccessTokenMutation(mockAuth),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate(mockToken);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expectInitialMutationState(result);
    });
  });
});
