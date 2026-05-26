import type { FirebaseError } from "firebase/app";
import { type DataSnapshot, onChildAdded, type Query } from "firebase/database";
import type { DatabaseUseQueryOptions } from "./types";
import { useDatabaseSubscriptionQuery } from "./useDatabaseSubscriptionQuery";

/**
 * Hook to subscribe to `child_added` events on a Realtime Database query.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#onchildadded | onChildAdded}.
 *
 * @param query - A `DatabaseReference` or `Query` (typically a list path).
 * @param options - TanStack Query options; `queryKey` is required.
 * @returns TanStack Query result with the latest child `DataSnapshot`.
 *
 * @remarks
 * Fires when a child is added. Does not replay existing children unless you attach before
 * writes occur. See {@link useOnValueQuery} to observe the full list.
 */
export function useOnChildAddedQuery(
  query: Query,
  options: DatabaseUseQueryOptions<DataSnapshot, FirebaseError>,
) {
  return useDatabaseSubscriptionQuery(query, onChildAdded, options);
}
