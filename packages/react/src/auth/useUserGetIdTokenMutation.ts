import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type AuthError, getIdToken, type User } from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> & {
  auth?: {
    forceRefresh?: boolean;
  };
};

export function useUserGetIdTokenMutation(
  user: User,
  options?: AuthUseMutationOptions<string, AuthError, boolean>,
) {
  return useMutation<string, AuthError, boolean>({
    ...options,
    mutationFn: (forceRefresh?: boolean) => getIdToken(user, forceRefresh),
  });
}
