import { useMutation } from "@tanstack/react-query";
import { type Analytics, logEvent } from "firebase/analytics";
import type { AnalyticsUseMutationOptions, LogEventVariables } from "./types";

/**
 * Hook to log a Google Analytics event via Firebase Analytics.
 *
 * Wraps {@link logEvent}. Pass event details as mutation variables; each field
 * maps directly to the Firebase API:
 * `logEvent(analyticsInstance, eventName, eventParams?, callOptions?)`.
 *
 * @param analytics - Firebase Analytics instance from `getAnalytics()` or `initializeAnalytics()`
 * @param options - TanStack Query mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * import { getAnalytics, logEvent } from 'firebase/analytics';
 * import { useLogEventMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const analytics = getAnalytics(app);
 * const { mutate: logAnalyticsEvent } = useLogEventMutation(analytics);
 *
 * logAnalyticsEvent({
 *   eventName: 'login',
 *   eventParams: { method: 'email' },
 * });
 *
 * @example
 * // Recommended screen tracking (replaces deprecated setCurrentScreen)
 * logAnalyticsEvent({
 *   eventName: 'screen_view',
 *   eventParams: {
 *     firebase_screen: 'Home',
 *     firebase_screen_class: 'HomeScreen',
 *   },
 * });
 *
 * @example
 * // Apply to all Google Analytics properties on the page
 * logAnalyticsEvent({
 *   eventName: 'purchase',
 *   eventParams: { transaction_id: 'T123', value: 9.99, currency: 'USD' },
 *   callOptions: { global: true },
 * });
 */
export function useLogEventMutation(
  analytics: Analytics,
  options?: AnalyticsUseMutationOptions<void, Error, LogEventVariables>,
) {
  return useMutation<void, Error, LogEventVariables>({
    ...options,
    mutationFn: async ({ eventName, eventParams, callOptions }) => {
      logEvent(analytics, eventName, eventParams, callOptions);
    },
  });
}
