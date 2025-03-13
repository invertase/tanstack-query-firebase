import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import {
  type QueryRef,
  type QueryResult,
  executeQuery,
  type CallerSdkType,
  CallerSdkTypeEnum,
} from "firebase/data-connect";
import type { PartialBy } from "../../utils";
import {
  FlattenedQueryResult,
  QueryResultMeta,
  QueryResultMetaObject,
  RESERVED_QUERY_FIELDS,
  ReservedQueryKeys,
} from "./types";

export type useDataConnectQueryOptions<
  TData = {},
  TError = FirebaseError
> = PartialBy<Omit<UseQueryOptions<TData, TError>, "queryFn">, "queryKey">;
export function useDataConnectQuery<Data = unknown, Variables = unknown>(
  refOrResult: QueryRef<Data, Variables> | QueryResult<Data, Variables>,
  options?: useDataConnectQueryOptions<
    FlattenedQueryResult<Data, Variables>,
    FirebaseError
  >,
  _callerSdkType: CallerSdkType = CallerSdkTypeEnum.TanstackReactCore
) {
  let queryRef: QueryRef<Data, Variables>;
  let initialData: FlattenedQueryResult<Data, Variables> | undefined;

  if ("ref" in refOrResult) {
    queryRef = refOrResult.ref;

    const resultMeta = getResultMeta(refOrResult);
    initialData = {
      ...refOrResult.data,
      ref: refOrResult.ref,
      source: refOrResult.source,
      fetchTime: refOrResult.fetchTime,
      resultMeta,
    };
  } else {
    queryRef = refOrResult;
  }
  // @ts-expect-error function is hidden under `DataConnect`.
  queryRef.dataConnect._setCallerSdkType(_callerSdkType);
  return useQuery<FlattenedQueryResult<Data, Variables>, FirebaseError>({
    ...options,
    initialData,
    queryKey: options?.queryKey ?? [queryRef.name, queryRef.variables || null],
    queryFn: async () => {
      const response = await executeQuery<Data, Variables>(queryRef);
      const resultMeta = getResultMeta(response);
      return {
        ...response.data,
        ref: response.ref,
        source: response.source,
        fetchTime: response.fetchTime,
        resultMeta,
      };
    },
  });
}

export function getResultMeta<Data, Variables>(
  response: QueryResult<Data, Variables>
) {
  let intersectionInfo: QueryResultMetaObject<Data> =
    {} as QueryResultMetaObject<Data>;
  RESERVED_QUERY_FIELDS.forEach((reserved: ReservedQueryKeys) => {
    if (reserved in (response.data as Object)) {
      intersectionInfo![reserved as keyof QueryResultMetaObject<Data>] =
        response.data[reserved as keyof QueryResultMetaObject<Data>];
    }
  });
  const resultMeta: QueryResultMeta<Data> = (
    Object.keys(intersectionInfo).length ? intersectionInfo : undefined
  ) as QueryResultMeta<Data>;
  return resultMeta;
}
