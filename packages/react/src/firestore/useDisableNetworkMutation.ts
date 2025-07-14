import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  disableNetwork,
  type Firestore,
  type FirestoreError,
} from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;

export function useDisableNetworkMutation(
  firestore: Firestore,
  options?: FirestoreUseMutationOptions<void, FirestoreError>,
) {
  return useMutation<void, FirestoreError>({
    ...options,
    mutationFn: () => disableNetwork(firestore),
  });
}
