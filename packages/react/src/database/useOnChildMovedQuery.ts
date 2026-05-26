import type { FirebaseError } from "firebase/app";
import { type DataSnapshot, onChildMoved, type Query } from "firebase/database";
import type { DatabaseUseQueryOptions } from "./types";
import { useDatabaseSubscriptionQuery } from "./useDatabaseSubscriptionQuery";

/**
 * Hook to subscribe to `child_moved` events on a Realtime Database query.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#onchildmoved | onChildMoved}.
 *
 * @param query - A `Query` ordered with `orderByPriority()` (required for move events).
 * @param options - TanStack Query options; `queryKey` is required.
 * @returns TanStack Query result with the latest moved child `DataSnapshot`.
 *
 * @remarks
 * `child_moved` is only raised for queries that use {@link https://firebase.google.com/docs/reference/js/database.md#orderbypriority | orderByPriority}.
 *
 * @example
 * ```tsx
 * const listQuery = query(ref(database, "items"), orderByPriority());
 * const { data: snapshot } = useOnChildMovedQuery(listQuery, {
 *   queryKey: ["database", "items", "moved"],
 * });
 * ```
 */
export function useOnChildMovedQuery(
  query: Query,
  options: DatabaseUseQueryOptions<DataSnapshot, FirebaseError>,
) {
  return useDatabaseSubscriptionQuery(query, onChildMoved, options);
}
