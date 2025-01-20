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
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> & {
  auth?: {
    forceRefresh?: boolean;
  };
};

export function userUserGetIdTokenResultMutation(
  user: User,
  options?: AuthUseMutationOptions<IdTokenResult, AuthError>
) {
  const { auth, ...mutationOptions } = options || {};
  const forceRefresh = auth?.forceRefresh;

  return useMutation<IdTokenResult, AuthError>({
    ...mutationOptions,
    mutationFn: () => getIdTokenResult(user, forceRefresh),
  });
}
