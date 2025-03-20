import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type DocumentData,
  type DocumentReference,
  type FirestoreError,
  type UpdateData,
  updateDoc,
} from "firebase/firestore";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  DbModelType extends DocumentData = DocumentData,
> = Omit<
  UseMutationOptions<TData, TError, UpdateData<DbModelType>>,
  "mutationFn"
>;

export function useUpdateDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  documentRef: DocumentReference<AppModelType, DbModelType>,
  options?: FirestoreUseMutationOptions<void, FirestoreError, DbModelType>,
) {
  return useMutation<void, FirestoreError, UpdateData<DbModelType>>({
    ...options,
    mutationFn: (data) => updateDoc(documentRef, data),
  });
}
