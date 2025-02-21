import { renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { useReauthenticateWithCredentialMutation } from "./useReauthenticateWithCredentialMutation";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { wrapper, queryClient } from "../../utils";
import { auth, expectFirebaseError, wipeAuth } from "~/testing-utils";

describe("useReauthenticateWithCredentialMutation", () => {
  let user: User;

  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
  });

  afterEach(async () => {
    await signOut(auth);
    queryClient.clear();
  });

  test("should successfully reauthenticate with correct credentials", async () => {
    const { result } = renderHook(
      () => useReauthenticateWithCredentialMutation(),
      { wrapper }
    );

    const credential = EmailAuthProvider.credential(email, password);

    result.current.mutate({
      user,
      credential,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.user.email).toBe(email);
  });

  test("should fail with incorrect credentials", async () => {
    const { result } = renderHook(
      () => useReauthenticateWithCredentialMutation(),
      { wrapper }
    );

    const wrongCredential = EmailAuthProvider.credential(
      email,
      "wrongPassword"
    );

    result.current.mutate({
      user,
      credential: wrongCredential,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expectFirebaseError(result.current.error, "auth/wrong-password");
  });

  test("should call onSuccess callback after successful reauthentication", async () => {
    let callbackCalled = false;

    const { result } = renderHook(
      () =>
        useReauthenticateWithCredentialMutation({
          onSuccess: () => {
            callbackCalled = true;
          },
        }),
      { wrapper }
    );

    const credential = EmailAuthProvider.credential(email, password);

    result.current.mutate({
      user,
      credential,
    });

    await waitFor(() => {
      expect(callbackCalled).toBe(true);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test("should call onError callback on authentication failure", async () => {
    let errorCode: string | undefined;

    const { result } = renderHook(
      () =>
        useReauthenticateWithCredentialMutation({
          onError: (error) => {
            errorCode = error.code;
          },
        }),
      { wrapper }
    );

    const wrongCredential = EmailAuthProvider.credential(
      email,
      "wrongPassword"
    );

    result.current.mutate({
      user,
      credential: wrongCredential,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expectFirebaseError(result.current.error, "auth/wrong-password");
    });
  });

  test("should handle multiple reauthentication attempts", async () => {
    const { result } = renderHook(
      () => useReauthenticateWithCredentialMutation(),
      { wrapper }
    );

    // First attempt - successful
    const correctCredential = EmailAuthProvider.credential(email, password);
    result.current.mutate({
      user,
      credential: correctCredential,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Second attempt - with wrong password
    const wrongCredential = EmailAuthProvider.credential(
      email,
      "wrongPassword"
    );
    result.current.mutate({
      user,
      credential: wrongCredential,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expectFirebaseError(result.current.error, "auth/wrong-password");
    });
  });
});
