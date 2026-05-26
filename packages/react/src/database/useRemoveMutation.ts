import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, remove } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to delete data at a Realtime Database location.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#remove | remove}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate()` with no arguments.
 */
export function useRemoveMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<void, FirebaseError, void>,
) {
  return useMutation<void, FirebaseError, void>({
    ...options,
    mutationFn: () => remove(ref),
  });
}
