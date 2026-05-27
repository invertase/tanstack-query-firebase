import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, onDisconnect } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to queue a `set` at a location when the client disconnects.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.ondisconnect.md#set | OnDisconnect.set}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate(value)` to register the disconnect write.
 */
export function useOnDisconnectSetMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<void, FirebaseError, unknown>,
) {
  return useMutation<void, FirebaseError, unknown>({
    ...options,
    mutationFn: (value) => onDisconnect(ref).set(value),
  });
}
