import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { type AuthError, getIdToken, type User } from "firebase/auth";

type AuthUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn" | "queryKey"
> & {
  auth?: {
    forceRefresh?: boolean;
  };
};

const STALE_TIME = 55 * 60 * 1000; // Firebase tokens expire after 1 hour
const GC_TIME = 60 * 60 * 1000; // Keep in cache for 1 hour
const QUERY_KEY_PREFIX = ["auth", "idToken"];

const NO_USER_ERROR_MESSAGE =
  "[useGetIdTokenQuery] Cannot retrieve ID token: no Firebase user provided. Ensure a user is signed in before calling this hook.";

/**
 * Hook to get an ID token for a Firebase user
 * @param user - The Firebase User object (or null)
 * @param options - Query options including auth configuration
 * @returns TanStack Query result with the ID token
 *
 * @remarks
 * If you override the `enabled` option and set it to `true` while `user` is null, the query will run and immediately error.
 * This is allowed for advanced use cases, but is not recommended for most scenarios.
 *
 * @example
 * // Basic usage - gets cached token
 * const { data: token, isLoading } = useGetIdTokenQuery(user);
 *
 * // Force refresh the token
 * const { data: token } = useGetIdTokenQuery(user, {
 *   auth: { forceRefresh: true }
 * });
 *
 * // With additional query options
 * const { data: token, refetch } = useGetIdTokenQuery(user, {
 *   enabled: !!user,
 *   onSuccess: (token) => {
 *     // Use token for API calls
 *     api.setAuthToken(token);
 *   }
 * });
 *
 * // Manually refresh token
 * const { refetch } = useGetIdTokenQuery(user);
 * const handleForceRefresh = () => refetch();
 */
export function useGetIdTokenQuery(
  user: User | null,
  options?: AuthUseQueryOptions<string, AuthError>,
) {
  const { auth: authOptions, ...queryOptions } = options || {};

  const forceRefresh = authOptions?.forceRefresh ?? false;

  const queryFn = () =>
    user
      ? getIdToken(user, forceRefresh)
      : Promise.reject(new Error(NO_USER_ERROR_MESSAGE));

  return useQuery<string, AuthError>({
    ...queryOptions,
    queryKey: user
      ? [...QUERY_KEY_PREFIX, user.uid, forceRefresh]
      : QUERY_KEY_PREFIX,
    queryFn,
    staleTime: forceRefresh ? 0 : STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!user && (options?.enabled ?? true),
  });
}
