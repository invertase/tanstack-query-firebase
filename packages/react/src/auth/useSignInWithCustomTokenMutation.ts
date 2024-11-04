import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  signInWithCustomToken,
  type Auth,
  type AuthError,
  type UserCredential,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useSignInWithCustomTokenMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<UserCredential, AuthError, string>
) {
  return useMutation<UserCredential, AuthError, string>({
    ...options,
    mutationFn: (customToken) => signInWithCustomToken(auth, customToken),
  });
}
