import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
	type Firestore,
	type FirestoreError,
	clearIndexedDbPersistence,
} from "firebase/firestore";

type UseFirestoreMutationOptions<TData = unknown, TError = Error> = Omit<
	UseMutationOptions<TData, TError, void>,
	"mutationFn"
>;

export function useClearIndexedDbPersistenceMutation(
	firestore: Firestore,
	options?: UseFirestoreMutationOptions<void, FirestoreError>,
) {
	return useMutation<void, FirestoreError>({
		...options,
		mutationFn: () => clearIndexedDbPersistence(firestore),
	});
}
