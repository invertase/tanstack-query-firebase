import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  enableNetwork,
  type Firestore,
  type FirestoreError,
} from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;

export function useEnableNetworkMutation(
  firestore: Firestore,
  options?: FirestoreUseMutationOptions<void, FirestoreError>,
) {
  return useMutation<void, FirestoreError>({
    ...options,
    mutationFn: () => enableNetwork(firestore),
  });
}
