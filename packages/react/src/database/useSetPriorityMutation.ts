import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, setPriority } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to set the priority of a Realtime Database location.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#setpriority | setPriority}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate(priority)` with a string, number, or `null`.
 */
export function useSetPriorityMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<
    void,
    FirebaseError,
    string | number | null
  >,
) {
  return useMutation<void, FirebaseError, string | number | null>({
    ...options,
    mutationFn: (priority) => setPriority(ref, priority),
  });
}
