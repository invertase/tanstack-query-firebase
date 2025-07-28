import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { useUserGetIdTokenResultMutation } from "./useUseGetIdTokenResultMutation";
import { queryClient, wrapper } from "../../utils";

describe("useUserGetIdTokenResultMutation", () => {
  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await auth.signOut();
  });

  test("successfully retrieves ID token result with forceRefresh true", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    const { result } = renderHook(() => useUserGetIdTokenResultMutation(user), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(true);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const tokenResult = result.current.data;

    // Verify all IdTokenResult properties exist and have correct types
    expect(tokenResult?.authTime).toBeTypeOf("string");
    expect(tokenResult?.issuedAtTime).toBeTypeOf("string");
    expect(tokenResult?.expirationTime).toBeTypeOf("string");
    expect(tokenResult?.token).toBeTypeOf("string");
    expect(tokenResult?.claims).toBeTypeOf("object");
    expect(
      typeof tokenResult?.signInProvider === "string" ||
        tokenResult?.signInProvider === null
    ).toBe(true);
    expect(
      typeof tokenResult?.signInSecondFactor === "string" ||
        tokenResult?.signInSecondFactor === null
    ).toBe(true);
  });

  test("can get token result with forceRefresh false", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    const { result } = renderHook(() => useUserGetIdTokenResultMutation(user), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(false);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const tokenResult = result.current.data;
    expect(tokenResult?.token).toBeTypeOf("string");
    expect(tokenResult?.claims).toBeTypeOf("object");
  });

  test("executes onSuccess callback with token result", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useUserGetIdTokenResultMutation(user, { onSuccess }),
      { wrapper }
    );

    await act(async () => {
      await result.current.mutateAsync(true);
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());

    const tokenResult = onSuccess.mock.calls[0][0];
    expect(tokenResult.token).toBeTypeOf("string");
    expect(tokenResult.claims).toBeTypeOf("object");
    expect(tokenResult.authTime).toBeTypeOf("string");
  });

  test("verifies signInProvider for password authentication", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    const { result } = renderHook(() => useUserGetIdTokenResultMutation(user), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(false);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const tokenResult = result.current.data;
    expect(tokenResult?.signInProvider).toBe("password");
    expect(tokenResult?.signInSecondFactor).toBeNull();
  });
});
