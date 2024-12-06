import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { Auth, type AuthError, deleteUser, type User } from "firebase/auth";

type AuthUMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useDeleteUserMutation(
  auth: Auth,
  options?: AuthUMutationOptions<void, AuthError, User>
) {
  return useMutation<void, AuthError, User>({
    ...options,
    mutationFn: (user: User) => deleteUser(user),
  });
}
