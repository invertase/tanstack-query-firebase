import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type AuthProvider,
  type AuthError,
  type User,
  type PopupRedirectResolver,
  UserCredential,
  reauthenticateWithPopup,
} from "firebase/auth";

type AuthMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useReauthenticateWithPopupMutation(
  provider: AuthProvider,
  options?: AuthMutationOptions<
    UserCredential,
    AuthError,
    {
      user: User;
      resolver?: PopupRedirectResolver;
    }
  >
) {
  return useMutation<
    UserCredential,
    AuthError,
    {
      user: User;
      resolver?: PopupRedirectResolver;
    }
  >({
    ...options,
    mutationFn: ({ user, resolver }) =>
      reauthenticateWithPopup(user, provider, resolver),
  });
}
