import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, onDisconnect } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to queue removal of data at a location when the client disconnects.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.ondisconnect.md#remove | OnDisconnect.remove}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate()` to register the operation.
 */
export function useOnDisconnectRemoveMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<void, FirebaseError, void>,
) {
  return useMutation<void, FirebaseError, void>({
    ...options,
    mutationFn: () => onDisconnect(ref).remove(),
  });
}
