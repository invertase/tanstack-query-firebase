import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  addDoc,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type FirestoreError,
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

export function useAddDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  collectionRef: CollectionReference<AppModelType, DbModelType>,
  options?: FirestoreUseMutationOptions<
    DocumentReference<AppModelType, DbModelType>,
    FirestoreError,
    AppModelType
  >,
) {
  return useMutation<
    DocumentReference<AppModelType, DbModelType>,
    FirestoreError,
    WithFieldValue<AppModelType>
  >({
    ...options,
    mutationFn: (data) => addDoc(collectionRef, data),
  });
}
