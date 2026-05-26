import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, setWithPriority } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

type SetWithPriorityVariables = {
  value: unknown;
  priority: string | number | null;
};

/**
 * Hook to write data and priority to a Realtime Database location in one operation.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#setwithpriority | setWithPriority}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate({ value, priority })`.
 *
 * @example
 * ```tsx
 * const { mutate } = useSetWithPriorityMutation(itemRef);
 * mutate({ value: { name: "Ada" }, priority: 1 });
 * ```
 */
export function useSetWithPriorityMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<
    void,
    FirebaseError,
    SetWithPriorityVariables
  >,
) {
  return useMutation<void, FirebaseError, SetWithPriorityVariables>({
    ...options,
    mutationFn: ({ value, priority }) => setWithPriority(ref, value, priority),
  });
}
