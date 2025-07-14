import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useSignInAnonymouslyMutation } from "./useSignInAnonymouslyMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useSignInAnonymouslyMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  afterEach(async () => {
    await auth.signOut();
  });

  test("successfully signs in anonymously", async () => {
    const { result } = renderHook(() => useSignInAnonymouslyMutation(auth), {
      wrapper,
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.user.isAnonymous).toBe(true);
  });

  test("resets mutation state correctly", async () => {
    const { result } = renderHook(() => useSignInAnonymouslyMutation(auth), {
      wrapper,
    });

    act(() => {
      result.current.mutateAsync();
    });

    await waitFor(() => {
      expect(result.current.data?.user.isAnonymous).toBe(true);
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

  test("allows multiple sequential sign-ins", async () => {
    const { result } = renderHook(() => useSignInAnonymouslyMutation(auth), {
      wrapper,
    });

    // First sign-in
    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.user.isAnonymous).toBe(true);
    });

    // Reset state
    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    // Second sign-in
    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.user.isAnonymous).toBe(true);
    });
  });
});
