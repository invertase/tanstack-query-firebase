import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, onDisconnect } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

type OnDisconnectSetWithPriorityVariables = {
  value: unknown;
  priority: string | number | null;
};

/**
 * Hook to queue a `setWithPriority` at a location when the client disconnects.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.ondisconnect.md#setwithpriority | OnDisconnect.setWithPriority}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate({ value, priority })`.
 */
export function useOnDisconnectSetWithPriorityMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<
    void,
    FirebaseError,
    OnDisconnectSetWithPriorityVariables
  >,
) {
  return useMutation<void, FirebaseError, OnDisconnectSetWithPriorityVariables>(
    {
      ...options,
      mutationFn: ({ value, priority }) =>
        onDisconnect(ref).setWithPriority(value, priority),
    },
  );
}
