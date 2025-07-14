import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
  type Auth,
  type AuthError,
  getRedirectResult,
  type PopupRedirectResolver,
  type UserCredential,
} from "firebase/auth";

type AuthUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError, void>,
  "queryFn"
> & { auth?: { resolver?: PopupRedirectResolver } };

export function useGetRedirectResultQuery(
  auth: Auth,
  options: AuthUseQueryOptions<UserCredential | null, AuthError>,
) {
  const { auth: authOptions, ...queryOptions } = options;
  const resolver = authOptions?.resolver;

  return useQuery<UserCredential | null, AuthError, void>({
    ...queryOptions,
    queryFn: () => getRedirectResult(auth, resolver),
  });
}
