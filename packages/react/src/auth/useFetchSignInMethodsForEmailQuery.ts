import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
  fetchSignInMethodsForEmail,
  type Auth,
  type AuthError,
} from "firebase/auth";

type AuthUseQueryOptions<
  TData = unknown,
  TError = Error,
  TVariables = void
> = Omit<UseQueryOptions<TData, TError, TVariables>, "queryFn">;

export function useFetchSignInMethodsForEmailQuery(
  auth: Auth,
  email: string,
  options: AuthUseQueryOptions<string[], AuthError, void>
) {
  return useQuery<string[], AuthError, void>({
    ...options,
    queryFn: async () => fetchSignInMethodsForEmail(auth, email),
  });
}
