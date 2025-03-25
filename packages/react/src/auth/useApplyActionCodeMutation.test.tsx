import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, expectFirebaseError, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useApplyActionCodeMutation } from "./useApplyActionCodeMutation";
import { waitForVerificationCode } from "./utils";

describe("useApplyActionCodeMutation", () => {
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

  test("successfully applies email verification action code", async () => {
    await sendEmailVerification(auth.currentUser!);
    const oobCode = await waitForVerificationCode(email);

    const { result } = renderHook(() => useApplyActionCodeMutation(auth), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(oobCode!);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  test("handles invalid action code", async () => {
    const invalidCode = "invalid-action-code";

    const { result } = renderHook(() => useApplyActionCodeMutation(auth), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(invalidCode);
      } catch (error) {
        expectFirebaseError(error, "auth/invalid-action-code");
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
    expectFirebaseError(result.current.error, "auth/invalid-action-code");
  });

  test("handles empty action code", async () => {
    const { result } = renderHook(() => useApplyActionCodeMutation(auth), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutateAsync("");
      } catch (error) {
        expectFirebaseError(error, "auth/invalid-req-type");
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
    expectFirebaseError(result.current.error, "auth/invalid-req-type");
  });

  test("executes onSuccess callback", async () => {
    await sendEmailVerification(auth.currentUser!);
    const oobCode = await waitForVerificationCode(email);
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useApplyActionCodeMutation(auth, { onSuccess }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync(oobCode!);
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  test("executes onError callback", async () => {
    const invalidCode = "invalid-action-code";
    const onError = vi.fn();

    const { result } = renderHook(
      () => useApplyActionCodeMutation(auth, { onError }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync(invalidCode);
      } catch (error) {
        expectFirebaseError(error, "auth/invalid-action-code");
      }
    });

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(onError.mock.calls[0][0]).toBeDefined();
    expectFirebaseError(result.current.error, "auth/invalid-action-code");
  });
});
