import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type Auth, signOut } from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useSignOutMutation(
  auth: Auth,
  options?: AuthUseMutationOptions,
) {
  return useMutation<void>({
    ...options,
    mutationFn: () => signOut(auth),
  });
}
