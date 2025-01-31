import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type DocumentReference,
  type FirestoreError,
  type WithFieldValue,
  type DocumentData,
  setDoc,
} from "firebase/firestore";

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<
  UseMutationOptions<TData, TError, void>,
  "mutationFn"
>;
export function useSetDocumentMutation<
  AppModelType extends DocumentData = DocumentData,
  DbModelType extends DocumentData = DocumentData
>(
  documentRef: DocumentReference<AppModelType, DbModelType>,
  data: WithFieldValue<AppModelType>,
  options?: FirestoreUseMutationOptions<void, FirestoreError>
) {
  return useMutation<void, FirestoreError>({
    ...options,
    mutationFn: () => setDoc(documentRef, data),
  });
}
