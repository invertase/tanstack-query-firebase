import { useQuery } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DataSnapshot, get, type Query } from "firebase/database";
import type { DatabaseUseQueryOptions } from "./types";

/**
 * Hook to read data once from a Realtime Database location.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#get | get}.
 *
 * @param query - A `DatabaseReference` or `Query` (from `ref()` / `query()`).
 * @param options - TanStack Query options; `queryKey` is required.
 * @returns TanStack Query result with a `DataSnapshot`.
 *
 * @example
 * ```tsx
 * const userRef = ref(database, `users/${uid}`);
 * const { data: snapshot, isLoading } = useGetQuery(userRef, {
 *   queryKey: ["database", "users", uid],
 * });
 * const value = snapshot?.val();
 * ```
 */
export function useGetQuery(
  query: Query,
  options: DatabaseUseQueryOptions<DataSnapshot, FirebaseError>,
) {
  const { database: _listenOptions, ...queryOptions } = options;

  return useQuery<DataSnapshot, FirebaseError>({
    ...queryOptions,
    queryFn: () => get(query),
  });
}
