import { useMutation } from "@tanstack/react-query";
import { type Auth, type AuthError, revokeAccessToken } from "firebase/auth";
import type { AuthMutationOptions } from "./types";

export function useRevokeAccessTokenMutation(
  auth: Auth,
  options?: AuthMutationOptions<void, AuthError, string>,
) {
  return useMutation<void, AuthError, string>({
    ...options,
    mutationFn: (token: string) => revokeAccessToken(auth, token),
  });
}
