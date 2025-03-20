import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, expectFirebaseError, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useCreateUserWithEmailAndPasswordMutation } from "./useCreateUserWithEmailAndPasswordMutation";

describe("useCreateUserWithEmailAndPasswordMutation", () => {
  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  test("successfully creates user", async () => {
    const { result } = renderHook(
      () => useCreateUserWithEmailAndPasswordMutation(auth),
      {
        wrapper,
      },
    );

    await act(async () => {
      const userCredential = await result.current.mutateAsync({
        email,
        password,
      });
      expect(userCredential.user.email).toBe(email);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  test("handles existing user", async () => {
    const { result: firstAttempt } = renderHook(
      () => useCreateUserWithEmailAndPasswordMutation(auth),
      {
        wrapper,
      },
    );

    await act(async () => {
      await firstAttempt.current.mutateAsync({ email, password });
    });

    const { result } = renderHook(
      () => useCreateUserWithEmailAndPasswordMutation(auth),
      {
        wrapper,
      },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({ email, password });
      } catch (error) {
        expectFirebaseError(error, "auth/email-already-in-use");
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expectFirebaseError(result.current.error, "auth/email-already-in-use");
  });

  test("handles weak password", async () => {
    const weakPassword = "weak";
    const { result } = renderHook(
      () => useCreateUserWithEmailAndPasswordMutation(auth),
      {
        wrapper,
      },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({ email, password: weakPassword });
      } catch (error) {
        expectFirebaseError(error, "auth/weak-password");
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expectFirebaseError(result.current.error, "auth/weak-password");
  });

  test("executes onSuccess callback", async () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useCreateUserWithEmailAndPasswordMutation(auth, { onSuccess }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({ email, password });
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  test("executes onError callback", async () => {
    const existingEmail = "tqf@invertase.io";
    const onError = vi.fn();

    const { result: firstAttempt } = renderHook(
      () => useCreateUserWithEmailAndPasswordMutation(auth),
      {
        wrapper,
      },
    );

    await act(async () => {
      await firstAttempt.current.mutateAsync({
        email: existingEmail,
        password,
      });
    });

    const { result } = renderHook(
      () => useCreateUserWithEmailAndPasswordMutation(auth, { onError }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({ email: existingEmail, password });
      } catch (error) {
        expectFirebaseError(error, "auth/email-already-in-use");
      }
    });

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(onError.mock.calls[0][0]).toBeDefined();
    expectFirebaseError(result.current.error, "auth/email-already-in-use");
  });
});
