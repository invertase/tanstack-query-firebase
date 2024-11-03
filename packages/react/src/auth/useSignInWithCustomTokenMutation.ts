import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  signInWithCustomToken,
  type Auth,
  type AuthError,
  type UserCredential,
} from "firebase/auth";

type SignInWithCustomTokenOptions = Omit<
  UseMutationOptions<UserCredential, AuthError, void>,
  "mutationFn"
>;

export function useSignInWithCustomTokenMutation(
  auth: Auth,
  customToken: string,
  options?: SignInWithCustomTokenOptions
) {
  return useMutation<UserCredential, AuthError>({
    ...options,
    mutationFn: () => signInWithCustomToken(auth, customToken),
  });
}
