import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type AuthCredential,
  reauthenticateWithCredential,
  type AuthError,
  type User,
  type UserCredential,
} from "firebase/auth";

type Variables = {
  user: User;
  credential: AuthCredential;
};

type AuthMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useReauthenticateWithCredentialMutation(
  options?: AuthMutationOptions<UserCredential, AuthError, Variables>
) {
  return useMutation<UserCredential, AuthError, Variables>({
    ...options,
    mutationFn: ({ user, credential }) =>
      reauthenticateWithCredential(user, credential),
  });
}
