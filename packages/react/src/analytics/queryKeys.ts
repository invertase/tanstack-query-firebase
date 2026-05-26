/**
 * Optional query key helpers for Analytics hooks.
 *
 * Analytics query hooks require a caller-provided `queryKey` (same as Firestore).
 * Use these factories to build consistent keys for invalidation and deduplication.
 *
 * @example
 * useGetGoogleAnalyticsClientIdQuery(analytics, {
 *   queryKey: analyticsQueryKeys.googleAnalyticsClientId(analytics.app.name),
 * });
 *
 * @example
 * useIsSupportedQuery({
 *   queryKey: analyticsQueryKeys.isSupported(),
 * });
 */
export const analyticsQueryKeys = {
  all: ["analytics"] as const,
  googleAnalyticsClientId: (appName: string) =>
    [...analyticsQueryKeys.all, "googleAnalyticsClientId", appName] as const,
  isSupported: () => [...analyticsQueryKeys.all, "isSupported"] as const,
};
