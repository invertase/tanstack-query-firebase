import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type Auth, type AuthError, confirmPasswordReset } from "firebase/auth";

type AuthUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useConfirmPasswordResetMutation(
  auth: Auth,
  options?: AuthUseMutationOptions<
    void,
    AuthError,
    { oobCode: string; newPassword: string }
  >,
) {
  return useMutation<void, AuthError, { oobCode: string; newPassword: string }>(
    {
      ...options,
      mutationFn: ({ oobCode, newPassword }) => {
        return confirmPasswordReset(auth, oobCode, newPassword);
      },
    },
  );
}
