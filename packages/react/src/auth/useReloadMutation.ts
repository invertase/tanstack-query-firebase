import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type AuthError, reload, type User } from "firebase/auth";

type AuthMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useReloadMutation(
  options?: AuthMutationOptions<void, AuthError, User>,
) {
  return useMutation<void, AuthError, User>({
    ...options,
    mutationFn: (user: User) => reload(user),
  });
}
