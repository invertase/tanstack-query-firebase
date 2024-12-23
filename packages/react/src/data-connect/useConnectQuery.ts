import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import type { PartialBy } from "../../utils";
import type { FlattenedQueryResult } from "./types";
import {
  type QueryRef,
  type QueryResult,
  executeQuery,
} from "firebase/data-connect";

export type UseConnectQueryOptions<
  TData = unknown,
  TError = FirebaseError
> = PartialBy<Omit<UseQueryOptions<TData, TError>, "queryFn">, "queryKey">;

export function useConnectQuery<Data = unknown, Variables = unknown>(
  refOrResult: QueryRef<Data, Variables> | QueryResult<Data, Variables>,
  options?: UseConnectQueryOptions<
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
