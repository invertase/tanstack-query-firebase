import { useQuery } from "@tanstack/react-query";
import { type Analytics, getGoogleAnalyticsClientId } from "firebase/analytics";
import type { AnalyticsUseQueryOptions } from "./types";

/**
 * Hook to retrieve the Google Analytics client ID for a Firebase Analytics instance.
 *
 * Wraps {@link getGoogleAnalyticsClientId}. The Firebase API accepts only an
 * `Analytics` instance and returns `Promise<string>` — there are no additional
 * read options to configure (unlike Firestore's server/cache source selector).
 *
 * @param analytics - Firebase Analytics instance from `getAnalytics()` or `initializeAnalytics()`
 * @param options - TanStack Query options; `queryKey` is required
 * @returns TanStack Query result with the client ID string
 *
 * @example
 * import { getAnalytics } from 'firebase/analytics';
 * import { analyticsQueryKeys, useGetGoogleAnalyticsClientIdQuery } from '@tanstack-query-firebase/react/analytics';
 *
 * const analytics = getAnalytics(app);
 *
 * const { data: clientId, isLoading } = useGetGoogleAnalyticsClientIdQuery(
 *   analytics,
 *   { queryKey: analyticsQueryKeys.googleAnalyticsClientId(analytics.app.name) },
 * );
 *
 * @example
 * // Disable until analytics is initialized
 * const { data: clientId } = useGetGoogleAnalyticsClientIdQuery(analytics, {
 *   queryKey: analyticsQueryKeys.googleAnalyticsClientId(analytics.app.name),
 *   enabled: !!analytics,
 * });
 */
export function useGetGoogleAnalyticsClientIdQuery(
  analytics: Analytics,
  options: AnalyticsUseQueryOptions<string>,
) {
  return useQuery<string>({
    ...options,
    queryFn: () => getGoogleAnalyticsClientId(analytics),
  });
}
