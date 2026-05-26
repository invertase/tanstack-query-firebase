import { useMutation } from "@tanstack/react-query";
import { type Analytics, setUserId } from "firebase/analytics";
import type { AnalyticsUseMutationOptions, SetUserIdVariables } from "./types";

/**
 * Hook to set or clear the Google Analytics user ID for a Firebase Analytics instance.
 *
 * Wraps {@link setUserId}. Mutation variables mirror the Firebase API:
 * `setUserId(analyticsInstance, id, callOptions?)`.
 *
 * @param analytics - Firebase Analytics instance from `getAnalytics()` or `initializeAnalytics()`
 * @param options - TanStack Query mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * import { getAnalytics } from 'firebase/analytics';
 * import { useSetUserIdMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const analytics = getAnalytics(app);
 * const { mutate: setAnalyticsUserId } = useSetUserIdMutation(analytics);
 *
 * setAnalyticsUserId({ id: user.uid });
 *
 * @example
 * // Clear user ID on sign-out
 * setAnalyticsUserId({ id: null });
 *
 * @example
 * // Apply user ID globally across all gtag properties on the page
 * setAnalyticsUserId({ id: user.uid, callOptions: { global: true } });
 */
export function useSetUserIdMutation(
  analytics: Analytics,
  options?: AnalyticsUseMutationOptions<void, Error, SetUserIdVariables>,
) {
  return useMutation<void, Error, SetUserIdVariables>({
    ...options,
    mutationFn: async ({ id, callOptions }) => {
      setUserId(analytics, id, callOptions);
    },
  });
}
