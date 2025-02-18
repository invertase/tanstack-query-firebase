import { renderHook, waitFor } from "@testing-library/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useFetchSignInMethodsForEmailQuery } from "./useFetchSignInMethodsForEmailQuery";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { auth, expectFirebaseError, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";

describe("useFetchSignInMethodsForEmailQuery", () => {
  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await auth.signOut();
  });

  test("should fetch sign in methods for existing user", async () => {
    const { result } = renderHook(
      () =>
        useFetchSignInMethodsForEmailQuery(auth, email, {
          queryKey: ["signInMethods", email],
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toContain("password");
  });

  test("should return empty array for non-existent user", async () => {
    const nonExistentEmail = "nonexistent@example.com";

    const { result } = renderHook(
      () =>
        useFetchSignInMethodsForEmailQuery(auth, nonExistentEmail, {
          queryKey: ["signInMethods", nonExistentEmail],
        }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  test("should not fetch when enabled is false", () => {
    const { result } = renderHook(
      () =>
        useFetchSignInMethodsForEmailQuery(auth, email, {
          queryKey: ["signInMethods", email],
          enabled: false,
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  test("should refetch when email changes", async () => {
    const newEmail = "another@example.com";

    await createUserWithEmailAndPassword(auth, newEmail, email);

    const { result, rerender } = renderHook(
      ({ email }) =>
        useFetchSignInMethodsForEmailQuery(auth, email, {
          queryKey: ["signInMethods", email],
        }),
      {
        wrapper,
        initialProps: { email: email },
      }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toContain("password");

    rerender({ email: newEmail });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toContain("password");
      expect(result.current.isLoading).toBe(false);
    });
  });

  test("should handle invalid email error", async () => {
    const invalidEmail = "not-an-email";

    const { result } = renderHook(
      () =>
        useFetchSignInMethodsForEmailQuery(auth, invalidEmail, {
          queryKey: ["signInMethods", invalidEmail],
        }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expectFirebaseError(result.current.error, "auth/invalid-email");
  });
});
