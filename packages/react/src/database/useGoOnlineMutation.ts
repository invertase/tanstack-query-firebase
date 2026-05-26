import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type Database, goOnline } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to reconnect the Realtime Database client to the server.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#goonline | goOnline}.
 *
 * @param database - The `Database` instance from `getDatabase()`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate()` to go online.
 */
export function useGoOnlineMutation(
  database: Database,
  options?: DatabaseMutationOptions<void, FirebaseError, void>,
) {
  return useMutation<void, FirebaseError, void>({
    ...options,
    mutationFn: async () => {
      goOnline(database);
    },
  });
}
