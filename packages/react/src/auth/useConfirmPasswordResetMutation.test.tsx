import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, expectFirebaseError, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useConfirmPasswordResetMutation } from "./useConfirmPasswordResetMutation";
import { waitForPasswordResetCode } from "./utils";

describe("useConfirmPasswordResetMutation", () => {
  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";
  const newPassword = "NewSecurePassword#456";

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await auth.signOut();
  });

  test("successfully resets password", async () => {
    await sendPasswordResetEmail(auth, email);
    const oobCode = await waitForPasswordResetCode(email);

    const { result } = renderHook(() => useConfirmPasswordResetMutation(auth), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({ oobCode: oobCode!, newPassword });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  test("handles invalid action code", async () => {
    const invalidCode = "invalid-action-code";

    const { result } = renderHook(() => useConfirmPasswordResetMutation(auth), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({ oobCode: invalidCode, newPassword });
      } catch (error) {
        expectFirebaseError(error, "auth/invalid-action-code");
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
    expectFirebaseError(result.current.error, "auth/invalid-action-code");
  });

  test("handles empty action code", async () => {
    const { result } = renderHook(() => useConfirmPasswordResetMutation(auth), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({ oobCode: "", newPassword });
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

    const { result } = renderHook(
      () => useConfirmPasswordResetMutation(auth, { onSuccess }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({ oobCode: oobCode!, newPassword });
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  test("executes onError callback", async () => {
    const invalidCode = "invalid-action-code";
    const onError = vi.fn();

    const { result } = renderHook(
      () => useConfirmPasswordResetMutation(auth, { onError }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({ oobCode: invalidCode, newPassword });
      } catch (error) {
        expectFirebaseError(error, "auth/invalid-action-code");
      }
    });

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(onError.mock.calls[0][0]).toBeDefined();
    expectFirebaseError(result.current.error, "auth/invalid-action-code");
  });
});
