import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  deleteDoc,
  type FirestoreError,
  type DocumentData,
  type DocumentReference,
} from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;

export function useDeleteDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData
>(
  documentRef: DocumentReference<AppModelType, DbModelType>,
  options?: FirestoreUseMutationOptions<void, FirestoreError>
) {
  return useMutation<void, FirestoreError>({
    ...options,
    mutationFn: () => deleteDoc(documentRef),
  });
}
