import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useSignInWithEmailAndPasswordMutation } from "./useSignInWithEmailAndPasswordMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useSignInWithEmailAndPasswordMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  afterEach(async () => {
    await auth.signOut();
  });

  test("successfully signs in with email and password", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";
    await createUserWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(
      () => useSignInWithEmailAndPasswordMutation(auth),
      { wrapper },
    );

    await act(async () => result.current.mutate({ email, password }));

    await waitFor(async () => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.user.email).toBe(email);
  });

  test("fails to sign in with incorrect password", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";
    const wrongPassword = "wrongpassword";

    await createUserWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(
      () => useSignInWithEmailAndPasswordMutation(auth),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ email, password: wrongPassword });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.isSuccess).toBe(false);
    // TODO: Assert Firebase error for auth/wrong-password
  });

  test("fails to sign in with non-existent email", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    const { result } = renderHook(
      () => useSignInWithEmailAndPasswordMutation(auth),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ email, password });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.isSuccess).toBe(false);
    // TODO: Assert Firebase error for auth/user-not-found
  });

  test("handles empty email input", async () => {
    const email = "";
    const password = "validPassword123";

    const { result } = renderHook(
      () => useSignInWithEmailAndPasswordMutation(auth),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ email, password });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.isSuccess).toBe(false);
    // TODO: Assert Firebase error for auth/invalid-email
  });

  test("handles empty password input", async () => {
    const email = "tqf@invertase.io";
    const password = "";

    const { result } = renderHook(
      () => useSignInWithEmailAndPasswordMutation(auth),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ email, password });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.isSuccess).toBe(false);
    // TODO: Assert Firebase error for auth/missing-password
  });

  test("handles concurrent sign in attempts", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    await createUserWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(
      () => useSignInWithEmailAndPasswordMutation(auth),
      { wrapper },
    );

    // Attempt multiple concurrent sign-ins
    await act(async () => {
      result.current.mutate({ email, password });
      result.current.mutate({ email, password });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.user.email).toBe(email);
  });

  test("handles sign in with custom mutation options", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    const onSuccessMock = vi.fn();

    await createUserWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(
      () =>
        useSignInWithEmailAndPasswordMutation(auth, {
          onSuccess: onSuccessMock,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ email, password });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessMock).toHaveBeenCalled();
    expect(result.current.data?.user.email).toBe(email);
  });
});
