import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  type UserCredential,
  signInAnonymously,
} from "firebase/auth";

type SignInAnonymouslyOptions = Omit<
  UseMutationOptions<UserCredential, AuthError, void>,
  "mutationFn"
>;

export function useSignInAnonymouslyMutation(
  auth: Auth,
  options?: SignInAnonymouslyOptions,
) {
  return useMutation<UserCredential, AuthError, void>({
    ...options,
    mutationFn: () => signInAnonymously(auth),
  });
}
