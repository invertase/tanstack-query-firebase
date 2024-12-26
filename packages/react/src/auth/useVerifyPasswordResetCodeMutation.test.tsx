import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import type React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useVerifyPasswordResetCodeMutation } from "./useVerifyPasswordResetCodeMutation";
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
      },
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
      { wrapper },
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
      { wrapper },
    );

    await act(async () => await result.current.mutate(emptyCode));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    // TODO: Assert Firebase error for auth/invalid-action-code
  });
});
