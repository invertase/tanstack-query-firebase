import { useMutation } from "@tanstack/react-query";
import { setConsent } from "firebase/analytics";
import type {
  AnalyticsUseMutationOptions,
  SetConsentVariables,
} from "./types";

/**
 * Hook to set end-user consent state for Google Analytics across all gtag references.
 *
 * Wraps {@link setConsent}. This is a module-level Firebase API (no `Analytics`
 * instance). The mutation variable is the `ConsentSettings` object passed
 * directly to the Firebase API: `setConsent(consentSettings)`.
 *
 * @param options - TanStack Query mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * import { useSetConsentMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const { mutate: setAnalyticsConsent } = useSetConsentMutation();
 *
 * setAnalyticsConsent({
 *   analytics_storage: 'granted',
 *   ad_storage: 'denied',
 * });
 *
 * @example
 * // Update consent after the user accepts a CMP banner
 * setAnalyticsConsent({
 *   analytics_storage: 'granted',
 *   ad_storage: 'granted',
 *   ad_user_data: 'granted',
 *   ad_personalization: 'denied',
 * });
 */
export function useSetConsentMutation(
  options?: AnalyticsUseMutationOptions<void, Error, SetConsentVariables>,
) {
  return useMutation<void, Error, SetConsentVariables>({
    ...options,
    mutationFn: async (consentSettings) => {
      setConsent(consentSettings);
    },
  });
}
