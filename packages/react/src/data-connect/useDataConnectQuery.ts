import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import {
  type QueryRef,
  type QueryResult,
  executeQuery,
} from "firebase/data-connect";
import type { PartialBy } from "../../utils";
import type { FlattenedQueryResult } from "./types";
import { listMoviesRef } from "@/dataconnect/default-connector";

export type useDataConnectQueryOptions<
  TData = unknown,
  TError = FirebaseError,
> = PartialBy<Omit<UseQueryOptions<TData, TError>, "queryFn">, "queryKey">;
useDataConnectQuery(listMoviesRef()).data!.movies
export function useDataConnectQuery2<Data = unknown, Variables = unknown, Ref extends QueryRef<Data, Variables> = QueryRef<Data, Variables>>(
  refOrResult: Ref
    | QueryResult<Data, Variables>,
  options?: useDataConnectQueryOptions<
    FlattenedQueryResult<Data, Variables>,
    FirebaseError
  >
) {
}
export function useDataConnectQuery<Data = unknown, Variables = unknown>(
  refOrResult: QueryRef<Data, Variables>
    | QueryResult<Data, Variables>,
  options?: useDataConnectQueryOptions<
    FlattenedQueryResult<Data, Variables>,
    FirebaseError
  >
) {
  let queryRef: QueryRef<Data, Variables>;
  let initialData: FlattenedQueryResult<Data, Variables> | undefined;

  if ("ref" in refOrResult) {
    queryRef = refOrResult.ref;
    initialData = {
      ...refOrResult.data,
      ref: refOrResult.ref,
      source: refOrResult.source,
      fetchTime: refOrResult.fetchTime,
    };
  } else {
    queryRef = refOrResult;
  }

  return useQuery<FlattenedQueryResult<Data, Variables>, FirebaseError>({
    ...options,
    initialData,
    queryKey: options?.queryKey ?? [queryRef.name, queryRef.variables || null],
    queryFn: async () => {
      const response = await executeQuery<Data, Variables>(queryRef);

      return {
        ...response.data,
        ref: response.ref,
        source: response.source,
        fetchTime: response.fetchTime,
      };
    },
  });
}
