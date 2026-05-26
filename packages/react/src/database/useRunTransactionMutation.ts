import { useMutation } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import {
  type DatabaseReference,
  runTransaction,
  type TransactionOptions,
  type TransactionResult,
} from "firebase/database";
import type { DatabaseMutationOptions } from "./types";

type TransactionUpdate = (
  currentData: unknown,
) => unknown;

type RunTransactionMutationOptions = DatabaseMutationOptions<
  TransactionResult,
  FirebaseError,
  void
> & {
  database?: TransactionOptions;
};

/**
 * Hook to run an atomic read-modify-write transaction on a Realtime Database location.
 *
 * Wraps Firebase {@link https://firebase.google.com/docs/reference/js/database.md#runtransaction | runTransaction}.
 *
 * @param ref - The target `DatabaseReference`.
 * @param transactionUpdate - Function that receives current data and returns the new value (or `undefined` to abort).
 * @param options - TanStack Mutation options. Pass `database` for {@link https://firebase.google.com/docs/reference/js/database.transactionoptions | TransactionOptions}.
 * @returns TanStack Mutation result with `TransactionResult` on success. Call `mutate()` to run.
 *
 * @example
 * ```tsx
 * const counterRef = ref(database, "counters/views");
 * const { mutate } = useRunTransactionMutation(counterRef, (current) => {
 *   const count = (current as number | null) ?? 0;
 *   return count + 1;
 * });
 * mutate();
 * ```
 */
export function useRunTransactionMutation(
  ref: DatabaseReference,
  transactionUpdate: TransactionUpdate,
  options?: RunTransactionMutationOptions,
) {
  const { database: transactionOptions, ...mutationOptions } = options ?? {};

  return useMutation<TransactionResult, FirebaseError, void>({
    ...mutationOptions,
    mutationFn: () =>
      runTransaction(ref, transactionUpdate, transactionOptions),
  });
}
