import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  linkWithCredential,
  type UserCredential,
  type User,
  type AuthCredential,
  type AuthError,
} from "firebase/auth";

type AuthMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useLinkWithCredentialMutation(
  user: User,
  options?: AuthMutationOptions<UserCredential, AuthError, AuthCredential>
) {
  return useMutation<UserCredential, AuthError, AuthCredential>({
    ...options,
    mutationFn: (credential: AuthCredential) =>
      linkWithCredential(user, credential),
  });
}
