import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type ActionCodeInfo,
  type Auth,
  type AuthError,
  checkActionCode,
} from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useCheckActionCodeMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<ActionCodeInfo, AuthError, string>,
) {
  return useMutation<ActionCodeInfo, AuthError, string>({
    ...options,
    mutationFn: (oobCode) => checkActionCode(auth, oobCode),
  });
}
