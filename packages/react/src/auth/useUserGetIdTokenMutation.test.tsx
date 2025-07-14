import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useUserGetIdTokenMutation } from "./useUserGetIdTokenMutation";

describe("useUserGetIdTokenMutation", () => {
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

  test("successfully retrieves an ID token with forceRefresh true", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(() => useUserGetIdTokenMutation(user), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(true);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(typeof result.current.data).toBe("string");
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  test("successfully retrieves an ID token with forceRefresh false", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(() => useUserGetIdTokenMutation(user), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(false);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(typeof result.current.data).toBe("string");
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  test("executes onSuccess callback with token", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useUserGetIdTokenMutation(user, { onSuccess }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync(true);
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(typeof onSuccess.mock.calls[0][0]).toBe("string");
    expect(onSuccess.mock.calls[0][0].length).toBeGreaterThan(0);
  });
});
