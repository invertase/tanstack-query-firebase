import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, push } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to append a child with an auto-generated key to a list.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#push | push}.
 *
 * @param ref - The list `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. `data` after success is the new child `DatabaseReference`.
 * Call `mutate(value)` or `mutate(undefined)` to push without a value.
 *
 * @example
 * ```tsx
 * const messagesRef = ref(database, "rooms/room-1/messages");
 * const { mutate, data: newRef } = usePushMutation(messagesRef);
 * mutate({ text: "Hello", sentAt: Date.now() });
 * ```
 */
export function usePushMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<
    DatabaseReference,
    FirebaseError,
    unknown | undefined
  >,
) {
  return useMutation<DatabaseReference, FirebaseError, unknown | undefined>({
    ...options,
    mutationFn: (value) => Promise.resolve(push(ref, value)),
  });
}
