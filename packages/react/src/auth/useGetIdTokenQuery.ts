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

const NO_USER_ERROR_MESSAGE =
  "[useGetIdTokenQuery] Cannot retrieve ID token: no Firebase user provided. Ensure a user is signed in before calling this hook.";

// Query key factory for auth-related queries
export const authQueryKeys = {
  all: ["auth"] as const,
  idToken: (userId: string | null, forceRefresh: boolean) =>
    [...authQueryKeys.all, "idToken", { userId, forceRefresh }] as const,
};

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
 * });
 *
 * // Handle side effects with useEffect
 * useEffect(() => {
 *   if (token) {
 *     // Use token for API calls
 *     api.setAuthToken(token);
 *   }
 * }, [token]);
 *
 * // Manually re-fetch token (respects the initial forceRefresh option)
 * const { refetch } = useGetIdTokenQuery(user);
 * const handleRefetch = () => refetch();
 *
 * // For actual force refresh, use a separate query with forceRefresh: true
 * const { data: freshToken, refetch: refetchFresh } = useGetIdTokenQuery(user, {
 *   auth: { forceRefresh: true },
 *   enabled: false, // Manual trigger only
 * });
 * const handleForceRefresh = () => refetchFresh();
 */
export function useGetIdTokenQuery(
  user: User | null,
  options?: AuthUseQueryOptions<string, AuthError | Error>,
) {
  const { auth: authOptions, ...queryOptions } = options || {};
  const forceRefresh = authOptions?.forceRefresh ?? false;

  const queryKey = authQueryKeys.idToken(user?.uid ?? null, forceRefresh);

  const queryFn = () =>
    user
      ? getIdToken(user, forceRefresh)
      : Promise.reject(new Error(NO_USER_ERROR_MESSAGE));

  return useQuery<string, AuthError | Error>({
    ...queryOptions,
    queryKey,
    queryFn,
    staleTime: forceRefresh ? 0 : STALE_TIME,
    gcTime: GC_TIME,
    enabled: options?.enabled !== undefined ? options.enabled : !!user,
  });
}
