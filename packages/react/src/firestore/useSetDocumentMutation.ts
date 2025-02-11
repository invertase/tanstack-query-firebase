import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type DocumentReference,
  type FirestoreError,
  type WithFieldValue,
  type DocumentData,
  setDoc,
} from "firebase/firestore";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  AppModelType extends DocumentData = DocumentData
> = Omit<
  UseMutationOptions<TData, TError, WithFieldValue<AppModelType>>,
  "mutationFn"
>;

export function useSetDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData
>(
  documentRef: DocumentReference<AppModelType, DbModelType>,
  options?: FirestoreUseMutationOptions<void, FirestoreError, AppModelType>
) {
  return useMutation<void, FirestoreError, WithFieldValue<AppModelType>>({
    ...options,
    mutationFn: (data) => setDoc(documentRef, data),
  });
}
