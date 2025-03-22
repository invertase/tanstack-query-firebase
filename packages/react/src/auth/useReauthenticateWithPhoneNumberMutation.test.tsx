import { renderHook, waitFor } from "@testing-library/react";
import {
  reauthenticateWithPhoneNumber,
  type User,
  type ApplicationVerifier,
  type ConfirmationResult,
} from "firebase/auth";
import { useReauthenticateWithPhoneNumberMutation } from "./useReauthenticateWithPhoneNumberMutation";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { wrapper, queryClient } from "../../utils";

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<typeof import("firebase/auth")>(
    "firebase/auth"
  );
  return {
    ...actual,
    reauthenticateWithPhoneNumber: vi.fn(),
  };
});

describe("useReauthenticateWithPhoneNumberMutation", () => {
  let user: User;
  let appVerifier: ApplicationVerifier;

  const phoneNumber = "+16505550101";

  beforeEach(async () => {
    queryClient.clear();
    vi.resetAllMocks();
    user = { uid: "test-user" } as User;
    appVerifier = { type: "recaptcha" } as ApplicationVerifier;
  });

  test("should successfully reauthenticate with correct phone number", async () => {
    const confirmationResult = {
      verificationId: "123456",
    } as ConfirmationResult;
    vi.mocked(reauthenticateWithPhoneNumber).mockResolvedValue(
      confirmationResult
    );

    const { result } = renderHook(
      () => useReauthenticateWithPhoneNumberMutation(appVerifier),
      { wrapper }
    );

    result.current.mutate({ user, phoneNumber });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe(confirmationResult);
    });
  });

  test("should fail with incorrect phone number", async () => {
    vi.mocked(reauthenticateWithPhoneNumber).mockRejectedValue({
      code: "auth/invalid-phone-number",
    });

    const { result } = renderHook(
      () => useReauthenticateWithPhoneNumberMutation(appVerifier),
      { wrapper }
    );

    result.current.mutate({ user, phoneNumber: "+123" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.code).toBe("auth/invalid-phone-number");
    });
  });

  test("should call onSuccess callback after successful reauthentication", async () => {
    let callbackCalled = false;
    const confirmationResult = {
      verificationId: "123456",
    } as ConfirmationResult;

    vi.mocked(reauthenticateWithPhoneNumber).mockResolvedValue(
      confirmationResult
    );

    const { result } = renderHook(
      () =>
        useReauthenticateWithPhoneNumberMutation(appVerifier, {
          onSuccess: () => {
            callbackCalled = true;
          },
        }),
      { wrapper }
    );

    result.current.mutate({ user, phoneNumber });

    await waitFor(() => {
      expect(callbackCalled).toBe(true);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test("should call onError callback on authentication failure", async () => {
    let errorCode: string | undefined;

    vi.mocked(reauthenticateWithPhoneNumber).mockRejectedValue({
      code: "auth/invalid-verification-code",
    });

    const { result } = renderHook(
      () =>
        useReauthenticateWithPhoneNumberMutation(appVerifier, {
          onError: (error) => {
            errorCode = error.code;
          },
        }),
      { wrapper }
    );

    result.current.mutate({ user, phoneNumber });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(errorCode).toBe("auth/invalid-verification-code");
    });
  });

  test("should handle multiple reauthentication attempts", async () => {
    const confirmationResult = {
      verificationId: "123456",
    } as ConfirmationResult;

    vi.mocked(reauthenticateWithPhoneNumber).mockResolvedValue(
      confirmationResult
    );

    const { result } = renderHook(
      () => useReauthenticateWithPhoneNumberMutation(appVerifier),
      { wrapper }
    );

    // First attempt
    result.current.mutate({ user, phoneNumber });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Second attempt
    result.current.mutate({ user, phoneNumber });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
