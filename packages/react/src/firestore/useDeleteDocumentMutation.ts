import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type DocumentData,
  type DocumentReference,
  deleteDoc,
  type FirestoreError,
} from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;

export function useDeleteDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  documentRef: DocumentReference<AppModelType, DbModelType>,
  options?: FirestoreUseMutationOptions<void, FirestoreError>,
) {
  return useMutation<void, FirestoreError>({
    ...options,
    mutationFn: () => deleteDoc(documentRef),
  });
}
