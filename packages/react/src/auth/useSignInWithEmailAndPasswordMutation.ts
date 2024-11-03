import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  signInWithEmailAndPassword,
  type UserCredential,
} from "firebase/auth";

type SignInWithEmailAndPassword = Omit<
  UseMutationOptions<UserCredential, AuthError, void>,
  "mutationFn"
>;

export function useSignInWithEmailAndPasswordMutation(
  auth: Auth,
  email: string,
  password: string,
  options?: SignInWithEmailAndPassword
) {
  return useMutation<UserCredential, AuthError>({
    ...options,
    mutationFn: () => signInWithEmailAndPassword(auth, email, password),
  });
}
