import type { FirebaseError } from "firebase/app";
import { type DataSnapshot, onValue, type Query } from "firebase/database";
import type { DatabaseUseQueryOptions } from "./types";
import { useDatabaseSubscriptionQuery } from "./useDatabaseSubscriptionQuery";

/**
 * Hook to subscribe to value events at a Realtime Database location.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#onvalue | onValue}.
 * The first snapshot resolves the query; later snapshots update the cache via `setQueryData`.
 *
 * @param query - A `DatabaseReference` or `Query`.
 * @param options - TanStack Query options; `queryKey` is required. Use `database` for `ListenOptions`.
 * @returns TanStack Query result with the latest `DataSnapshot`.
 *
 * @remarks
 * Components sharing the same `queryKey` share one TanStack Query cache entry. Use a stable,
 * unique `queryKey` per path to avoid duplicate Firebase listeners. For a one-time read, prefer
 * {@link useGetQuery}.
 *
 * @example
 * ```tsx
 * const userRef = ref(database, `users/${uid}`);
 * const { data: snapshot } = useOnValueQuery(userRef, {
 *   queryKey: ["database", "onValue", "users", uid],
 * });
 * ```
 */
export function useOnValueQuery(
  query: Query,
  options: DatabaseUseQueryOptions<DataSnapshot, FirebaseError>,
) {
  return useDatabaseSubscriptionQuery(query, onValue, options);
}
