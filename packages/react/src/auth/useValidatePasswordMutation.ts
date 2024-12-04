import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  type PasswordValidationStatus,
  validatePassword,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useValidatePasswordMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<PasswordValidationStatus, AuthError, string>
) {
  return useMutation<PasswordValidationStatus, AuthError, string>({
    ...options,
    mutationFn: (password: string) => validatePassword(auth, password),
  });
}
