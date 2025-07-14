import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
  type DocumentData,
  type Firestore,
  type FirestoreError,
  namedQuery,
  type Query,
} from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export function useNamedQuery<
  _AppModelType = DocumentData,
  _DbModelType extends DocumentData = DocumentData,
>(
  firestore: Firestore,
  name: string,
  options: FirestoreUseQueryOptions<Query | null, FirestoreError>,
) {
  return useQuery<Query | null, FirestoreError>({
    ...options,
    queryFn: () => namedQuery(firestore, name),
  });
}
