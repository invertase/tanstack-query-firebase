import { useMutation } from "@tanstack/react-query";
import { type Analytics, setCurrentScreen } from "firebase/analytics";
import type {
  AnalyticsUseMutationOptions,
  SetCurrentScreenVariables,
} from "./types";

/**
 * Hook to set the current screen name via gtag config.
 *
 * Wraps {@link setCurrentScreen}. Mutation variables mirror the Firebase API:
 * `setCurrentScreen(analyticsInstance, screenName, callOptions?)`.
 *
 * @deprecated Prefer {@link useLogEventMutation} with `eventName: 'screen_view'`
 * and `eventParams.firebase_screen` / `eventParams.firebase_screen_class`.
 *
 * @param analytics - Firebase Analytics instance from `getAnalytics()` or `initializeAnalytics()`
 * @param options - TanStack Query mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * import { getAnalytics } from 'firebase/analytics';
 * import { useSetCurrentScreenMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const analytics = getAnalytics(app);
 * const { mutate: setScreen } = useSetCurrentScreenMutation(analytics);
 *
 * setScreen({ screenName: 'Home' });
 *
 * @example
 * // Prefer screen_view events for new code
 * import { useLogEventMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const { mutate: logEvent } = useLogEventMutation(analytics);
 * logEvent({
 *   eventName: 'screen_view',
 *   eventParams: { firebase_screen: 'Home' },
 * });
 */
export function useSetCurrentScreenMutation(
  analytics: Analytics,
  options?: AnalyticsUseMutationOptions<void, Error, SetCurrentScreenVariables>,
) {
  return useMutation<void, Error, SetCurrentScreenVariables>({
    ...options,
    mutationFn: async ({ screenName, callOptions }) => {
      setCurrentScreen(analytics, screenName, callOptions);
    },
  });
}
