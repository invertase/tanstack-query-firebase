import { useMutation } from "@tanstack/react-query";
import {
  type Analytics,
  setAnalyticsCollectionEnabled,
} from "firebase/analytics";
import type { AnalyticsUseMutationOptions } from "./types";

/**
 * Hook to enable or disable Google Analytics collection for an app on the current device.
 *
 * Wraps {@link setAnalyticsCollectionEnabled}. The mutation variable is the
 * `enabled` boolean passed directly to the Firebase API:
 * `setAnalyticsCollectionEnabled(analyticsInstance, enabled)`.
 *
 * @param analytics - Firebase Analytics instance from `getAnalytics()` or `initializeAnalytics()`
 * @param options - TanStack Query mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * import { getAnalytics } from 'firebase/analytics';
 * import { useSetAnalyticsCollectionEnabledMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const analytics = getAnalytics(app);
 * const { mutate: setCollectionEnabled } =
 *   useSetAnalyticsCollectionEnabledMutation(analytics);
 *
 * // Opt user out of analytics collection
 * setCollectionEnabled(false);
 *
 * @example
 * // Re-enable after consent is granted
 * setCollectionEnabled(true);
 */
export function useSetAnalyticsCollectionEnabledMutation(
  analytics: Analytics,
  options?: AnalyticsUseMutationOptions<void, Error, boolean>,
) {
  return useMutation<void, Error, boolean>({
    ...options,
    mutationFn: async (enabled) => {
      setAnalyticsCollectionEnabled(analytics, enabled);
    },
  });
}
