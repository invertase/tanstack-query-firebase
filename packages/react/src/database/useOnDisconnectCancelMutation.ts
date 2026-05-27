import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, onDisconnect } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to cancel all pending on-disconnect operations at a location.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.ondisconnect.md#cancel | OnDisconnect.cancel}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate()` to cancel queued disconnect writes.
 */
export function useOnDisconnectCancelMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<void, FirebaseError, void>,
) {
  return useMutation<void, FirebaseError, void>({
    ...options,
    mutationFn: () => onDisconnect(ref).cancel(),
  });
}
