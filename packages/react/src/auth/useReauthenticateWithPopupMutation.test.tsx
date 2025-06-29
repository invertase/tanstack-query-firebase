import { renderHook, waitFor } from "@testing-library/react";
import {
  GoogleAuthProvider,
  type User,
  type UserCredential,
  reauthenticateWithPopup,
  AuthError,
} from "firebase/auth";
import { useReauthenticateWithPopupMutation } from "./useReauthenticateWithPopupMutation";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { wrapper, queryClient } from "../../utils";

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<typeof import("firebase/auth")>(
    "firebase/auth"
  );
  return {
    ...actual,
    reauthenticateWithPopup: vi.fn(),
  };
});

describe("useReauthenticateWithPopupMutation", () => {
  const mockUser = { uid: "test-uid", email: "test@example.com" } as User;
  const mockCredential = {
    user: mockUser,
    providerId: "google.com",
    operationType: "reauthenticate",
  } as UserCredential;

  beforeEach(async () => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  test("should successfully reauthenticate with popup", async () => {
    const provider = new GoogleAuthProvider();
    vi.mocked(reauthenticateWithPopup).mockResolvedValueOnce(mockCredential);

    const { result } = renderHook(
      () => useReauthenticateWithPopupMutation(provider),
      { wrapper }
    );

    result.current.mutate({
      user: mockUser,
    });

    await waitFor(() => {
      expect(reauthenticateWithPopup).toHaveBeenCalledWith(
        mockUser,
        provider,
        undefined
      );
      expect(result.current.data).toBe(mockCredential);
    });
  });

  test("should handle popup closed by user", async () => {
    const provider = new GoogleAuthProvider();
    const mockError: Partial<AuthError> = {
      code: "auth/popup-closed-by-user",
      message: "The popup has been closed by the user",
      name: "AuthError",
    };

    vi.mocked(reauthenticateWithPopup).mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => useReauthenticateWithPopupMutation(provider),
      { wrapper }
    );

    result.current.mutate({
      user: mockUser,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.code).toBe("auth/popup-closed-by-user");
    });
  });

  test("should handle optional resolver parameter", async () => {
    const provider = new GoogleAuthProvider();
    const mockResolver = {
      _popupRedirectResolver: "mock",
    };

    vi.mocked(reauthenticateWithPopup).mockResolvedValueOnce(mockCredential);

    const { result } = renderHook(
      () => useReauthenticateWithPopupMutation(provider),
      { wrapper }
    );

    result.current.mutate({
      user: mockUser,
      resolver: mockResolver,
    });

    await waitFor(() => {
      expect(reauthenticateWithPopup).toHaveBeenCalledWith(
        mockUser,
        provider,
        mockResolver
      );
    });
  });

  test("should call lifecycle hooks in correct order", async () => {
    const provider = new GoogleAuthProvider();
    const lifecycleCalls: string[] = [];

    vi.mocked(reauthenticateWithPopup).mockResolvedValueOnce(mockCredential);

    const { result } = renderHook(
      () =>
        useReauthenticateWithPopupMutation(provider, {
          onSettled: () => {
            lifecycleCalls.push("onSettled");
          },
          onSuccess: () => {
            lifecycleCalls.push("onSuccess");
          },
          onError: () => {
            lifecycleCalls.push("onError");
          },
        }),
      { wrapper }
    );

    result.current.mutate({
      user: mockUser,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(lifecycleCalls).toEqual(["onSuccess", "onSettled"]);
    });
  });
});
