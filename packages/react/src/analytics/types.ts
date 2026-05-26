import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import type {
  AnalyticsCallOptions,
  ConsentSettings,
  CustomEventName,
  CustomParams,
  EventNameString,
  EventParams,
} from "firebase/analytics";

/**
 * TanStack Query options for Analytics read hooks.
 * Caller must provide `queryKey` (same as Firestore hooks).
 * Firebase Analytics read APIs expose no additional query parameters beyond
 * the `Analytics` instance passed to the hook.
 */
export type AnalyticsUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export type AnalyticsUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

/**
 * Variables for {@link useLogEventMutation}.
 * Mirrors `logEvent(analyticsInstance, eventName, eventParams?, callOptions?)`.
 */
export type LogEventVariables<T extends string = string> = {
  eventName: EventNameString | CustomEventName<T>;
  eventParams?: EventParams;
  callOptions?: AnalyticsCallOptions;
};

/**
 * Variables for {@link useSetUserIdMutation}.
 * Mirrors `setUserId(analyticsInstance, id, callOptions?)`.
 */
export type SetUserIdVariables = {
  id: string | null;
  callOptions?: AnalyticsCallOptions;
};

/**
 * Variables for {@link useSetUserPropertiesMutation}.
 * Mirrors `setUserProperties(analyticsInstance, properties, callOptions?)`.
 */
export type SetUserPropertiesVariables = {
  properties: CustomParams;
  callOptions?: AnalyticsCallOptions;
};

/**
 * Variables for {@link useSetCurrentScreenMutation}.
 * Mirrors `setCurrentScreen(analyticsInstance, screenName, callOptions?)`.
 *
 * @deprecated Prefer {@link useLogEventMutation} with `eventName: 'screen_view'`.
 */
export type SetCurrentScreenVariables = {
  screenName: string;
  callOptions?: AnalyticsCallOptions;
};

/**
 * Variables for {@link useSetConsentMutation}.
 * Mirrors `setConsent(consentSettings)`.
 */
export type SetConsentVariables = ConsentSettings;

/**
 * Variables for {@link useSetDefaultEventParametersMutation}.
 * Mirrors `setDefaultEventParameters(customParams)`.
 */
export type SetDefaultEventParametersVariables = CustomParams;
