import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import { type DatabaseReference, update } from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

/**
 * Hook to perform a multi-path update without replacing data at `ref`.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#update | update}.
 *
 * @param ref - The parent `DatabaseReference` (keys in `values` are relative child paths).
 * @param options - TanStack Mutation options.
 * @returns TanStack Mutation result. Call `mutate(values)` with a partial update object.
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateMutation(userRef);
 * mutate({ "settings/theme": "dark", score: 10 });
 * ```
 */
export function useUpdateMutation(
  ref: DatabaseReference,
  options?: DatabaseMutationOptions<
    void,
    FirebaseError,
    Record<string, unknown>
  >,
) {
  return useMutation<void, FirebaseError, Record<string, unknown>>({
    ...options,
    mutationFn: (values) => update(ref, values),
  });
}
