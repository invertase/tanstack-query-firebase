import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  signInWithEmailAndPassword,
  type UserCredential,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useSignInWithEmailAndPasswordMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<
    UserCredential,
    AuthError,
    { email: string; password: string }
  >,
) {
  return useMutation<
    UserCredential,
    AuthError,
    { email: string; password: string }
  >({
    ...options,
    mutationFn: ({ email, password }) =>
      signInWithEmailAndPassword(auth, email, password),
  });
}
