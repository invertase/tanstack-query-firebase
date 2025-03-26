import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  type MultiFactorError,
  getMultiFactorResolver,
  MultiFactorResolver,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useMultiFactorResolverResolveSignInMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<
    MultiFactorResolver,
    AuthError,
    MultiFactorError
  >
) {
  return useMutation<MultiFactorResolver, AuthError, MultiFactorError>({
    ...options,
    mutationFn: async (error) => getMultiFactorResolver(auth, error),
  });
}
