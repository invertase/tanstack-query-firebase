import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type DocumentReference,
  type FirestoreError,
  type WithFieldValue,
  type CollectionReference,
  type DocumentData,
  addDoc,
} from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;
export function useAddDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData
>(
  collectionRef: CollectionReference<AppModelType, DbModelType>,
  data: WithFieldValue<AppModelType>,
  options?: FirestoreUseMutationOptions<
    DocumentReference<AppModelType, DbModelType>,
    FirestoreError
  >
) {
  return useMutation<
    DocumentReference<AppModelType, DbModelType>,
    FirestoreError
  >({
    ...options,
    mutationFn: () => addDoc(collectionRef, data),
  });
}
