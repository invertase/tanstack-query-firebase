import { act, renderHook, waitFor } from "@testing-library/react";
import {
  type ActionCodeInfo,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, expectFirebaseError, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useCheckActionCodeMutation } from "./useCheckActionCodeMutation";
import { waitForPasswordResetCode } from "./utils";

describe("useCheckActionCodeMutation", () => {
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

  test("successfully checks password reset action code", async () => {
    await sendPasswordResetEmail(auth, email);
    const oobCode = await waitForPasswordResetCode(email);

    if (!oobCode) {
      throw new Error("oobCode is null");
    }

    const { result } = renderHook(() => useCheckActionCodeMutation(auth), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(oobCode);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const actionCodeInfo = result.current.data as ActionCodeInfo;
    expect(actionCodeInfo.operation).toBe("PASSWORD_RESET");
    expect(actionCodeInfo.data.email).toBe(email);
  });

  test("handles invalid action code", async () => {
    const invalidCode = "invalid-action-code";

    const { result } = renderHook(() => useCheckActionCodeMutation(auth), {
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
    const { result } = renderHook(() => useCheckActionCodeMutation(auth), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutateAsync("");
      } catch (error) {
        expectFirebaseError(error, "auth/internal-error");
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
    expectFirebaseError(result.current.error, "auth/internal-error");
  });

  test("executes onSuccess callback", async () => {
    await sendPasswordResetEmail(auth, email);
    const oobCode = await waitForPasswordResetCode(email);
    const onSuccess = vi.fn();

    if (!oobCode) {
      throw new Error("oobCode is null");
    }

    const { result } = renderHook(
      () => useCheckActionCodeMutation(auth, { onSuccess }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync(oobCode);
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());

    const actionCodeInfo = onSuccess.mock.calls[0][0] as ActionCodeInfo;
    expect(actionCodeInfo.operation).toBe("PASSWORD_RESET");
    expect(actionCodeInfo.data.email).toBe(email);
  });

  test("executes onError callback", async () => {
    const invalidCode = "invalid-action-code";
    const onError = vi.fn();

    const { result } = renderHook(
      () => useCheckActionCodeMutation(auth, { onError }),
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
