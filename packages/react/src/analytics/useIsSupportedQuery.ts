import { useQuery } from "@tanstack/react-query";
import { isSupported } from "firebase/analytics";
import type { AnalyticsUseQueryOptions } from "./types";

/**
 * Hook to check whether Firebase Analytics is supported in the current environment.
 *
 * Wraps {@link isSupported}. The Firebase API takes no parameters and returns
 * `Promise<boolean>` — there are no additional read options to configure.
 *
 * @param options - TanStack Query options; `queryKey` is required
 * @returns TanStack Query result with the support check boolean
 *
 * @example
 * import { analyticsQueryKeys, useIsSupportedQuery } from '@tanstack-query-firebase/react/analytics';
 *
 * const { data: supported, isLoading } = useIsSupportedQuery({
 *   queryKey: analyticsQueryKeys.isSupported(),
 * });
 *
 * if (supported) {
 *   // Safe to call getAnalytics()
 * }
 *
 * @example
 * // Gate analytics initialization
 * const { data: supported } = useIsSupportedQuery({
 *   queryKey: analyticsQueryKeys.isSupported(),
 *   staleTime: Number.POSITIVE_INFINITY,
 * });
 */
export function useIsSupportedQuery(
  options: AnalyticsUseQueryOptions<boolean>,
) {
  return useQuery<boolean>({
    ...options,
    queryFn: () => isSupported(),
  });
}
