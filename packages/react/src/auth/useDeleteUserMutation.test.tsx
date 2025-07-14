import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createUserWithEmailAndPassword, type User } from "firebase/auth";
import type React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useDeleteUserMutation } from "./useDeleteUserMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useVerifyPasswordResetCodeMutation", () => {
  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";
  let user: User;

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    user = userCredential.user;
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await auth.signOut();
  });

  test("successfully verifies the reset code", async () => {
    const { result } = renderHook(() => useDeleteUserMutation(auth), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(user);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeUndefined();
  });

  test("resets mutation state correctly", async () => {
    const { result } = renderHook(() => useDeleteUserMutation(auth), {
      wrapper,
    });

    act(() => {
      result.current.mutate(user);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  test("should call onSuccess when the user is successfully deleted", async () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useDeleteUserMutation(auth, {
          onSuccess,
        }),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.mutate(user);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBeUndefined();
  });
});
