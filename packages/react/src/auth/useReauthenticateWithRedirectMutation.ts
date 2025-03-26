import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type AuthProvider,
  reauthenticateWithRedirect,
  type AuthError,
  type User,
  type PopupRedirectResolver,
} from "firebase/auth";

type AuthMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useReauthenticateWithRedirectMutation(
  provider: AuthProvider,
  options?: AuthMutationOptions<
    never,
    AuthError,
    {
      user: User;
      resolver?: PopupRedirectResolver;
    }
  >
) {
  return useMutation<
    never,
    AuthError,
    {
      user: User;
      resolver?: PopupRedirectResolver;
    }
  >({
    ...options,
    mutationFn: ({ user, resolver }) =>
      reauthenticateWithRedirect(user, provider, resolver),
  });
}
