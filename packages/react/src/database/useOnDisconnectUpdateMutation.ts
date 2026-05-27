import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, onDisconnect } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to queue a multi-path `update` at a location when the client disconnects.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.ondisconnect.md#update | OnDisconnect.update}.
 *
 * @param ref - The parent `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate(values)` with a partial update object.
 */
export function useOnDisconnectUpdateMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<
    void,
    FirebaseError,
    Record<string, unknown>
  >,
) {
  return useMutation<void, FirebaseError, Record<string, unknown>>({
    ...options,
    mutationFn: (values) => onDisconnect(ref).update(values),
  });
}
