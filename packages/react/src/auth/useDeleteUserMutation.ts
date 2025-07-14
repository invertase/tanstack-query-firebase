import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  deleteUser,
  type User,
} from "firebase/auth";

type AuthUMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useDeleteUserMutation(
  _auth: Auth,
  options?: AuthUMutationOptions<void, AuthError, User>,
) {
  return useMutation<void, AuthError, User>({
    ...options,
    mutationFn: (user: User) => deleteUser(user),
  });
}
