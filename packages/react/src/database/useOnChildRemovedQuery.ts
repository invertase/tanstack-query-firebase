import type { FirebaseError } from "firebase/app";
import {
  type DataSnapshot,
  onChildRemoved,
  type Query,
} from "firebase/database";
import type { DatabaseUseQueryOptions } from "./types";
import { useDatabaseSubscriptionQuery } from "./useDatabaseSubscriptionQuery";

/**
 * Hook to subscribe to `child_removed` events on a Realtime Database query.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#onchildremoved | onChildRemoved}.
 *
 * @param query - A `DatabaseReference` or `Query`.
 * @param options - TanStack Query options; `queryKey` is required.
 * @returns TanStack Query result with the removed child `DataSnapshot` (may have null value).
 *
 * @remarks
 * Fires when a child is deleted from the query result.
 */
export function useOnChildRemovedQuery(
  query: Query,
  options: DatabaseUseQueryOptions<DataSnapshot, FirebaseError>,
) {
  return useDatabaseSubscriptionQuery(query, onChildRemoved, options);
}
