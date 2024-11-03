import {
  type Auth,
  type UserCredential,
  type AuthError,
  signInWithCredential,
  type AuthCredential,
} from "firebase/auth";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

type SignInWithCredentialMutationOptions = Omit<
  UseMutationOptions<UserCredential, AuthError, AuthCredential>,
  "mutationFn"
>;

export function useSignInWithCredentialMutation(
  auth: Auth,
  options?: SignInWithCredentialMutationOptions
) {
  return useMutation<UserCredential, AuthError, AuthCredential>({
    ...options,
    mutationFn: (credential: AuthCredential) =>
      signInWithCredential(auth, credential),
  });
}
