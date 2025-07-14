import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import type React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useUpdateCurrentUserMutation } from "./useUpdateCurrentUserMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useUpdateCurrentUserMutation", () => {
  // const currentUser: User | null = null;

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  afterEach(async () => {
    await auth.signOut();
  });

  test("successfully updates current user", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    await createUserWithEmailAndPassword(auth, email, password);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const newUser = userCredential.user;

    const { result } = renderHook(() => useUpdateCurrentUserMutation(auth), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(newUser);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auth.currentUser?.uid).toBe(newUser.uid);
    expect(auth.currentUser?.email).toBe(email);
  });

  test("successfully sets current user to null", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    await createUserWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(() => useUpdateCurrentUserMutation(auth), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(null);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auth.currentUser).toBeNull();
  });

  test("handles update error when user is invalid", async () => {
    const invalidUser = { uid: "invalid-uid" } as User;

    const { result } = renderHook(() => useUpdateCurrentUserMutation(auth), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(invalidUser);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    // TODO: Assert for firebase error
  });

  test("calls onSuccess callback after successful update", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";
    const onSuccessMock = vi.fn();

    await createUserWithEmailAndPassword(auth, email, password);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const newUser = userCredential.user;

    const { result } = renderHook(
      () =>
        useUpdateCurrentUserMutation(auth, {
          onSuccess: onSuccessMock,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate(newUser);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessMock).toHaveBeenCalled();
    expect(auth.currentUser?.email).toBe(email);
  });

  test("calls onError callback on update failure", async () => {
    const onErrorMock = vi.fn();
    const error = new Error("Update failed");

    // Mock updateCurrentUser to simulate error
    const mockUpdateUser = vi
      .spyOn(auth, "updateCurrentUser")
      .mockRejectedValueOnce(error);

    const { result } = renderHook(
      () =>
        useUpdateCurrentUserMutation(auth, {
          onError: onErrorMock,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate(null);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
    expect(result.current.isSuccess).toBe(false);
    mockUpdateUser.mockRestore();
  });

  test("handles concurrent update attempts", async () => {
    const email = "tqf@invertase.io";
    const password = "tanstackQueryFirebase#123";

    await createUserWithEmailAndPassword(auth, email, password);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const newUser = userCredential.user;

    const { result } = renderHook(() => useUpdateCurrentUserMutation(auth), {
      wrapper,
    });

    await act(async () => {
      // Attempt multiple concurrent updates
      result.current.mutate(newUser);
      result.current.mutate(newUser);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auth.currentUser?.uid).toBe(newUser.uid);
    expect(auth.currentUser?.email).toBe(email);
  });
});
