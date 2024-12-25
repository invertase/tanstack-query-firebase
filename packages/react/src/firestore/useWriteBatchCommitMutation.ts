import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { FirestoreError, WriteBatch } from "firebase/firestore";

type FirestoreUseMutationOptions<TError = Error> = Omit<
  UseMutationOptions<void, TError, WriteBatch>,
  "mutationFn"
>;

export function useWriteBatchCommitMutation(
  options?: FirestoreUseMutationOptions<FirestoreError>,
) {
  return useMutation<void, FirestoreError, WriteBatch>({
    ...options,
    mutationFn: (batch: WriteBatch) => batch.commit(),
  });
}
