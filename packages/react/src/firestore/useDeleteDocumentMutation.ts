import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  deleteDoc,
  type FirestoreError,
  type DocumentData,
  type DocumentReference,
} from "firebase/firestore";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = unknown
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

export function useDeleteDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData
>(
  options?: FirestoreUseMutationOptions<
    void,
    FirestoreError,
    DocumentReference<AppModelType, DbModelType>
  >
) {
  return useMutation<
    void,
    FirestoreError,
    DocumentReference<AppModelType, DbModelType>
  >({
    ...options,
    mutationFn: (documentRef) => deleteDoc(documentRef),
  });
}
