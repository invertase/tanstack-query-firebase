import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type AuthError,
  type User,
  type ApplicationVerifier,
  type ConfirmationResult,
  reauthenticateWithPhoneNumber,
} from "firebase/auth";

type AuthMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useReauthenticateWithPhoneNumberMutation(
  appVerifier: ApplicationVerifier,
  options?: AuthMutationOptions<
    ConfirmationResult,
    AuthError,
    {
      user: User;
      phoneNumber: string;
    }
  >
) {
  return useMutation<
    ConfirmationResult,
    AuthError,
    {
      user: User;
      phoneNumber: string;
    }
  >({
    ...options,
    mutationFn: ({ user, phoneNumber }) =>
      reauthenticateWithPhoneNumber(user, phoneNumber, appVerifier),
  });
}
