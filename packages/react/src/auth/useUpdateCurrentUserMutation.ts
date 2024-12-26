import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  type User,
  updateCurrentUser,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useUpdateCurrentUserMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<void, AuthError, User | null>,
) {
  return useMutation<void, AuthError, User | null>({
    ...options,
    mutationFn: (user) => updateCurrentUser(auth, user),
  });
}
