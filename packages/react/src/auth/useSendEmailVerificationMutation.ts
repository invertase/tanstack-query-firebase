import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type ActionCodeSettings,
  type AuthError,
  sendEmailVerification,
  type User,
} from "firebase/auth";

type AuthMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> & {
  actionCodeSettings?: ActionCodeSettings | null;
};

export function useSendEmailVerificationMutation(
  user: User,
  options?: AuthMutationOptions<void, AuthError, ActionCodeSettings | null>
) {
  return useMutation<void, AuthError, ActionCodeSettings | null>({
    ...options,
    mutationFn: (actionCodeSettings?: ActionCodeSettings | null) =>
      sendEmailVerification(user, actionCodeSettings),
  });
}
