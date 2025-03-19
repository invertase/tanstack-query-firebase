import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type React from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useSignOutMutation } from "./useSignOutMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useSignOutMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  test("successfully signs out an authenticated user", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    await createUserWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(() => useSignOutMutation(auth), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auth.currentUser).toBeNull();
  });

  test("handles sign out for a non-authenticated user", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    await createUserWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);

    await auth.signOut();

    const { result } = renderHook(() => useSignOutMutation(auth), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auth.currentUser).toBeNull();
  });

  test("calls onSuccess callback after successful sign out", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";
    const onSuccessMock = vi.fn();

    await createUserWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(
      () => useSignOutMutation(auth, { onSuccess: onSuccessMock }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessMock).toHaveBeenCalled();
  });

  test("calls onError callback on sign out failure", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";
    const onErrorMock = vi.fn();
    const error = new Error("Sign out failed");

    await createUserWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);

    const mockSignOut = vi.spyOn(auth, "signOut").mockRejectedValueOnce(error);

    const { result } = renderHook(
      () => useSignOutMutation(auth, { onError: onErrorMock }),
      { wrapper },
    );

    await act(async () => result.current.mutate());

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(onErrorMock).toHaveBeenCalled();
    expect(result.current.error).toBe(error);
    expect(result.current.isSuccess).toBe(false);
    mockSignOut.mockRestore();
  });

  test("handles concurrent sign out attempts", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    await createUserWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(() => useSignOutMutation(auth), { wrapper });

    await act(async () => {
      // Attempt multiple concurrent sign-outs
      result.current.mutate();
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auth.currentUser).toBeNull();
  });
});
