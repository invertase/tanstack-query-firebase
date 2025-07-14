import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  type DocumentData,
  type DocumentReference,
  type FirestoreError,
  setDoc,
  type WithFieldValue,
} from "firebase/firestore";

type FirestoreUseMutationOptions<
  TData = unknown,
  TError = Error,
  AppModelType extends DocumentData = DocumentData,
> = Omit<
  UseMutationOptions<TData, TError, WithFieldValue<AppModelType>>,
  "mutationFn"
>;

export function useSetDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  documentRef: DocumentReference<AppModelType, DbModelType>,
  options?: FirestoreUseMutationOptions<void, FirestoreError, AppModelType>,
) {
  return useMutation<void, FirestoreError, WithFieldValue<AppModelType>>({
    ...options,
    mutationFn: (data) => setDoc(documentRef, data),
  });
}
