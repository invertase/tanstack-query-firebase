import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type User,
  type AuthError,
  getIdTokenResult,
  type IdTokenResult,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useUserGetIdTokenResultMutation(
  user: User,
  options?: AuthUseMutationOptions<IdTokenResult, AuthError, boolean>
) {
  return useMutation<IdTokenResult, AuthError, boolean>({
    ...options,
    mutationFn: (forceRefresh?: boolean) =>
      getIdTokenResult(user, forceRefresh),
  });
}
