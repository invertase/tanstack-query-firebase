import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, set } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to write data to a Realtime Database location, replacing any existing data.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#set | set}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate(value)` to write.
 *
 * @example
 * ```tsx
 * const userRef = ref(database, `users/${uid}`);
 * const { mutate } = useSetMutation(userRef);
 * mutate({ name: "Ada", score: 1 });
 * ```
 */
export function useSetMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<void, FirebaseError, unknown>,
) {
  return useMutation<void, FirebaseError, unknown>({
    ...options,
    mutationFn: (value) => set(ref, value),
  });
}
