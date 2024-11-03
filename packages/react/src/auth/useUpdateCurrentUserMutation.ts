import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { type Auth, updateCurrentUser, type User } from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useUpdateCurrentUserMutation(
  auth: Auth,
  user: User | null,
  options?: AuthUseMutationOptions
) {
  return useMutation<void>({
    ...options,
    mutationFn: () => updateCurrentUser(auth, user),
  });
}
