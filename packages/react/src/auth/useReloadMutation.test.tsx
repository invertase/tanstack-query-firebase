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
import { useReloadMutation } from "./useReloadMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useReloadMutation", () => {
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

  test.sequential("should successfully reloads user data", async () => {
    await signInWithEmailAndPassword(auth, email, password);

    const { result } = renderHook(() => useReloadMutation(), { wrapper });

    act(() => result.current.mutate(user));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  test("should handle onSuccess callback", async () => {
    await signInWithEmailAndPassword(auth, email, password);

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useReloadMutation({ onSuccess }), {
      wrapper,
    });

    act(() => {
      result.current.mutate(user);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccess).toHaveBeenCalled();
  });
});
