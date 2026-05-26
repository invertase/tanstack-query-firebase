import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type Database, goOffline } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to disconnect the Realtime Database client from the server.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#gooffline | goOffline}.
 *
 * @param database - The `Database` instance from `getDatabase()`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate()` to go offline.
 */
export function useGoOfflineMutation(
  database: Database,
  options?: DatabaseMutationOptions<void, FirebaseError, void>,
) {
  return useMutation<void, FirebaseError, void>({
    ...options,
    mutationFn: async () => {
      goOffline(database);
    },
  });
}
