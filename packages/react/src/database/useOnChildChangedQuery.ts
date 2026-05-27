import type { FirebaseError } from "firebase/app";
import {
  type DataSnapshot,
  onChildChanged,
  type Query,
} from "firebase/database";
import type { DatabaseUseQueryOptions } from "./types";
import { useDatabaseSubscriptionQuery } from "./useDatabaseSubscriptionQuery";

/**
 * Hook to subscribe to `child_changed` events on a Realtime Database query.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#onchildchanged | onChildChanged}.
 *
 * @param query - A `DatabaseReference` or `Query`.
 * @param options - TanStack Query options; `queryKey` is required.
 * @returns TanStack Query result with the latest changed child `DataSnapshot`.
 *
 * @remarks
 * Fires when an existing child is modified, not when a child is first created.
 */
export function useOnChildChangedQuery(
  query: Query,
  options: DatabaseUseQueryOptions<DataSnapshot, FirebaseError>,
) {
  return useDatabaseSubscriptionQuery(query, onChildChanged, options);
}
