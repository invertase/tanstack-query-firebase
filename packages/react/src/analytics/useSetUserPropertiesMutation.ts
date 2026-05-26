import { useMutation } from "@tanstack/react-query";
import { type Analytics, setUserProperties } from "firebase/analytics";
import type {
  AnalyticsUseMutationOptions,
  SetUserPropertiesVariables,
} from "./types";

/**
 * Hook to set Google Analytics user properties for a Firebase Analytics instance.
 *
 * Wraps {@link setUserProperties}. Mutation variables mirror the Firebase API:
 * `setUserProperties(analyticsInstance, properties, callOptions?)`.
 *
 * @param analytics - Firebase Analytics instance from `getAnalytics()` or `initializeAnalytics()`
 * @param options - TanStack Query mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * import { getAnalytics } from 'firebase/analytics';
 * import { useSetUserPropertiesMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const analytics = getAnalytics(app);
 * const { mutate: setAnalyticsUserProperties } =
 *   useSetUserPropertiesMutation(analytics);
 *
 * setAnalyticsUserProperties({
 *   properties: { plan: 'premium', role: 'admin' },
 * });
 *
 * @example
 * setAnalyticsUserProperties({
 *   properties: { plan: 'free' },
 *   callOptions: { global: true },
 * });
 */
export function useSetUserPropertiesMutation(
  analytics: Analytics,
  options?: AnalyticsUseMutationOptions<void, Error, SetUserPropertiesVariables>,
) {
  return useMutation<void, Error, SetUserPropertiesVariables>({
    ...options,
    mutationFn: async ({ properties, callOptions }) => {
      setUserProperties(analytics, properties, callOptions);
    },
  });
}
