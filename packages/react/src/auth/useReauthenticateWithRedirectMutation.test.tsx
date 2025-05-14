import { renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  type User,
  reauthenticateWithRedirect,
  AuthError,
} from "firebase/auth";
import { useReauthenticateWithRedirectMutation } from "./useReauthenticateWithRedirectMutation";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { wrapper, queryClient } from "../../utils";
import { auth, wipeAuth } from "~/testing-utils";

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<typeof import("firebase/auth")>(
    "firebase/auth"
  );
  return {
    ...actual,
    reauthenticateWithRedirect: vi.fn(),
    getRedirectResult: vi.fn(),
  };
});

describe("useReauthenticateWithRedirectMutation", () => {
  let user: User;

  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";

  const mockUser = { uid: "test-uid", email: "test@example.com" } as User;

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    vi.clearAllMocks();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
  });

  afterEach(async () => {
    await signOut(auth);
  });

  test("should initiate redirect reauthentication", async () => {
    const provider = new GoogleAuthProvider();

    const { result } = renderHook(
      () => useReauthenticateWithRedirectMutation(provider),
      { wrapper }
    );

    result.current.mutate({
      user: mockUser,
    });

    await waitFor(() => {
      expect(reauthenticateWithRedirect).toHaveBeenCalledWith(
        mockUser,
        provider,
        undefined
      );
    });
  });

  test("should handle reauthentication error", async () => {
    const provider = new GoogleAuthProvider();
    const mockError: Partial<AuthError> = {
      code: "auth/operation-not-allowed",
      message: "Operation not allowed",
      name: "AuthError",
    };

    vi.mocked(reauthenticateWithRedirect).mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => useReauthenticateWithRedirectMutation(provider),
      { wrapper }
    );

    result.current.mutate({
      user: mockUser,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
    });
  });

  test("should call lifecycle hooks in correct order", async () => {
    const provider = new GoogleAuthProvider();
    const lifecycleCalls: string[] = [];

    const { result } = renderHook(
      () =>
        useReauthenticateWithRedirectMutation(provider, {
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

  test("should handle optional resolver parameter", async () => {
    const provider = new GoogleAuthProvider();
    const mockResolver = {
      _redirectPersistence: "mock",
      _redirectUri: "mock",
    };

    const { result } = renderHook(
      () => useReauthenticateWithRedirectMutation(provider),
      { wrapper }
    );

    result.current.mutate({
      user: mockUser,
      resolver: mockResolver,
    });

    await waitFor(() => {
      expect(reauthenticateWithRedirect).toHaveBeenCalledWith(
        mockUser,
        provider,
        mockResolver
      );
    });
  });
});
