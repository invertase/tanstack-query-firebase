import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type User, type AuthError, getIdToken } from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> & {
  auth?: {
    forceRefresh?: boolean;
  };
};

export function useUserGetIdTokenMutation(
  user: User,
  options?: AuthUseMutationOptions<string, AuthError>
) {
  const { auth, ...mutationOptions } = options || {};
  const forceRefresh = auth?.forceRefresh;

  return useMutation<string, AuthError>({
    ...mutationOptions,
    mutationFn: () => getIdToken(user, forceRefresh),
  });
}
