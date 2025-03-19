import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type Auth, type AuthError, applyActionCode } from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useApplyActionCodeMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<void, AuthError, string>,
) {
  return useMutation<void, AuthError, string>({
    ...options,
    mutationFn: (oobCode) => {
      return applyActionCode(auth, oobCode);
    },
  });
}
