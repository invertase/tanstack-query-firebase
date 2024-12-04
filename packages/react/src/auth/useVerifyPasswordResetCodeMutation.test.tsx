import React from "react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useVerifyPasswordResetCodeMutation } from "./useVerifyPasswordResetCodeMutation";
import { auth, wipeAuth } from "~/testing-utils";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { waitForPasswordResetCode } from "./utils";

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

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    await sendPasswordResetEmail(auth, email);
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await auth.signOut();
  });

  test("successfully verifies the reset code", async () => {
    const code = await waitForPasswordResetCode(email);

    const { result } = renderHook(
      () => useVerifyPasswordResetCodeMutation(auth),
      {
        wrapper,
      }
    );

    await act(async () => {
      code && (await result.current.mutateAsync(code));
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(email);
    expect(result.current.variables).toBe(code);
  });

  test("handles invalid reset code", async () => {
    const invalidCode = "invalid-reset-code";

    const { result } = renderHook(
      () => useVerifyPasswordResetCodeMutation(auth),
      { wrapper }
    );

    await act(async () => {
      await result.current.mutate(invalidCode);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    // TODO: Assert Firebase error for auth/invalid-action-code
  });

  test("handles empty reset code", async () => {
    const emptyCode = "";

    const { result } = renderHook(
      () => useVerifyPasswordResetCodeMutation(auth),
      { wrapper }
    );

    await act(async () => await result.current.mutate(emptyCode));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    // TODO: Assert Firebase error for auth/invalid-action-code
  });
});
