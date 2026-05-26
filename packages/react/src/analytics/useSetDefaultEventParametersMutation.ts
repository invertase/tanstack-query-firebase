import { useMutation } from "@tanstack/react-query";
import { setDefaultEventParameters } from "firebase/analytics";
import type {
  AnalyticsUseMutationOptions,
  SetDefaultEventParametersVariables,
} from "./types";

/**
 * Hook to set default event parameters applied to every Analytics event on the page.
 *
 * Wraps {@link setDefaultEventParameters}. This is a module-level Firebase API
 * (no `Analytics` instance). The mutation variable is the `CustomParams` object
 * passed directly to the Firebase API: `setDefaultEventParameters(customParams)`.
 *
 * @param options - TanStack Query mutation options
 * @returns TanStack Query mutation result
 *
 * @example
 * import { useSetDefaultEventParametersMutation } from '@tanstack-query-firebase/react/analytics';
 *
 * const { mutate: setDefaultParams } = useSetDefaultEventParametersMutation();
 *
 * setDefaultParams({ session_id: 'abc123', debug_mode: true });
 *
 * @example
 * // Parameters persist for subsequent automatic and manual events on this page
 * setDefaultParams({ campaign: 'spring_sale' });
 */
export function useSetDefaultEventParametersMutation(
  options?: AnalyticsUseMutationOptions<
    void,
    Error,
    SetDefaultEventParametersVariables
  >,
) {
  return useMutation<void, Error, SetDefaultEventParametersVariables>({
    ...options,
    mutationFn: async (customParams) => {
      setDefaultEventParameters(customParams);
    },
  });
}
