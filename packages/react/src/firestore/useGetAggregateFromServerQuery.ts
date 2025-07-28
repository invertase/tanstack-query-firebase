import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
  type AggregateQuerySnapshot,
  type AggregateSpec,
  type DocumentData,
  type FirestoreError,
  getAggregateFromServer,
  type Query,
} from "firebase/firestore";

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export function useGetAggregateFromServerQuery<
  T extends AggregateSpec,
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  query: Query<AppModelType, DbModelType>,
  aggregateSpec: T,
  options: FirestoreUseQueryOptions<
    AggregateQuerySnapshot<T, AppModelType, DbModelType>,
    FirestoreError
  >,
) {
  return useQuery<
    AggregateQuerySnapshot<T, AppModelType, DbModelType>,
    FirestoreError
  >({
    ...options,
    queryFn: () => getAggregateFromServer(query, aggregateSpec),
  });
}
