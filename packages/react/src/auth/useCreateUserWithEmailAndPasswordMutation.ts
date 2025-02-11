import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  type UserCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useCreateUserWithEmailAndPasswordMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<
    UserCredential,
    AuthError,
    { email: string; password: string }
  >
) {
  return useMutation<
    UserCredential,
    AuthError,
    { email: string; password: string }
  >({
    ...options,
    mutationFn: ({ email, password }) =>
      createUserWithEmailAndPassword(auth, email, password),
  });
}
