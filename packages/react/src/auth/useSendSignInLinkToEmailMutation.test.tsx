import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useSendSignInLinkToEmailMutation } from "./useSendSignInLinkToEmailMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useSendSignInLinkToEmailMutation", () => {
  const email = "tanstack-query-firebase@invertase.io";
  const actionCodeSettings = {
    url: `https://invertase.io/?email=${email}`,
    iOS: {
      bundleId: "com.example.ios",
    },
    android: {
      packageName: "com.example.android",
      installApp: true,
      minimumVersion: "12",
    },
    handleCodeInApp: true,
  };

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  test("resets mutation state correctly", async () => {
    const { result } = renderHook(
      () => useSendSignInLinkToEmailMutation(auth),
      { wrapper },
    );

    act(() => {
      result.current.mutate({ email, actionCodeSettings });
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

  test("successfully sends sign-in link to email", async () => {
    const { result } = renderHook(
      () => useSendSignInLinkToEmailMutation(auth),
      { wrapper },
    );

    act(() => {
      result.current.mutate({ email, actionCodeSettings });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("allows multiple sequential send attempts", async () => {
    const { result } = renderHook(
      () => useSendSignInLinkToEmailMutation(auth),
      { wrapper },
    );

    // First attempt
    act(() => {
      result.current.mutate({ email, actionCodeSettings });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
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

    // Second attempt
    act(() => {
      result.current.mutate({ email, actionCodeSettings });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.error).toBeNull();
  });
});
