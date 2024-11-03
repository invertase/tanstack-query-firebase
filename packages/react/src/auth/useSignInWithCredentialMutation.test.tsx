import React from "react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { auth, wipeAuth } from "~/testing-utils";
import { useSignInWithCredentialMutation } from "./useSignInWithCredentialMutation";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useSignInWithCredentialMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  test("successfully signs in with email and password", async () => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "tqf@invertase.io",
      "tanstackQueryFirebase#123"
    );

    const authCredential = EmailAuthProvider.credential(
      "tqf@invertase.io",
      "tanstackQueryFirebase#123"
    );

    const { result } = renderHook(() => useSignInWithCredentialMutation(auth), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(authCredential);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.user.email).toEqual("tqf@invertase.io");
    });
  });

  test("successfully signs in with Google credential", async () => {
    const googleProvider = new GoogleAuthProvider();
    const testToken = {
      sub: "tanstackQueryFirebase#123",
      email: "tqf@invertase.io",
      email_verified: true,
      name: "TanStack Query Firebase",
    };

    const authCredential = GoogleAuthProvider.credential(
      JSON.stringify(testToken)
    );

    const { result } = renderHook(() => useSignInWithCredentialMutation(auth), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(authCredential);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.user.email).toEqual("tqf@invertase.io");
    });
  });

  test("should handle concurrent sign-in attempts", async () => {
    const testToken1 = {
      sub: "12345",
      email: "tqf1@invertase.io",
      email_verified: true,
      name: "TanStack Query Firebase 1",
    };
    const testToken2 = {
      sub: "67890",
      email: "tqf2@invertase.io",
      email_verified: true,
      name: "TanStack Query Firebase 2",
    };

    const authCredential1 = GoogleAuthProvider.credential(
      JSON.stringify(testToken1)
    );
    const authCredential2 = GoogleAuthProvider.credential(
      JSON.stringify(testToken2)
    );

    const { result } = renderHook(() => useSignInWithCredentialMutation(auth), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(authCredential1);
      result.current.mutate(authCredential2);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the last sign-in
    expect(result.current.data?.user.email).toEqual("tqf2@invertase.io");
  });

  test("executes custom onSuccess handler", async () => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "tqf@invertase.io",
      "tanstackQueryFirebase#123"
    );

    const onSuccess = vi.fn();
    const authCredential = EmailAuthProvider.credential(
      "tqf@invertase.io",
      "tanstackQueryFirebase#123"
    );

    const { result } = renderHook(
      () => useSignInWithCredentialMutation(auth, { onSuccess }),
      { wrapper }
    );

    await act(async () => {
      result.current.mutate(authCredential);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test("executes custom onError handler", async () => {
    const onError = vi.fn();
    const authCredential = EmailAuthProvider.credential(
      "wrongemail@example.com",
      "wrongPassword#123"
    );

    const { result } = renderHook(
      () => useSignInWithCredentialMutation(auth, { onError }),
      { wrapper }
    );

    act(async () => {
      result.current.mutate(authCredential);
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });
});
