import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import {
  type QueryRef,
  type QueryResult,
  executeQuery,
  type CallerSdkType,
  CallerSdkTypeEnum,
  MutationResult,
} from "firebase/data-connect";
import type { PartialBy } from "../../utils";
import { FlattenedQueryResult, QueryResultIntersection, RESERVED_OPERATION_FIELDS } from "./types";


export type useDataConnectQueryOptions<
  TData = {},
  TError = FirebaseError,
> = PartialBy<Omit<UseQueryOptions<TData, TError>, "queryFn">, "queryKey">;
export function useDataConnectQuery<Data = unknown, Variables = unknown>(
  refOrResult: QueryRef<Data, Variables>
    | QueryResult<Data, Variables>,
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
    // TODO(mtewani): Move this to a function.
    let resultMeta: QueryResultIntersection<Data> =
        undefined as QueryResultIntersection<Data>;
    RESERVED_OPERATION_FIELDS.forEach((reserved) => {
        if (!resultMeta) {
          resultMeta = {
            [reserved]:
              refOrResult.data[
                reserved as keyof Data & keyof QueryResultIntersection<Data>
              ],
          } as QueryResultIntersection<Data>;
        } else {
          resultMeta![reserved as keyof QueryResultIntersection<Data>];
        }
      });
    initialData = {
      ...refOrResult.data,
      ref: refOrResult.ref,
      source: refOrResult.source,
      fetchTime: refOrResult.fetchTime,
      resultMeta
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
      let resultMeta: QueryResultIntersection<Data> =
        undefined as QueryResultIntersection<Data>;
      RESERVED_OPERATION_FIELDS.forEach((reserved) => {
        if (!resultMeta) {
          resultMeta = {
            [reserved]:
              response.data[
                reserved as keyof Data & keyof QueryResultIntersection<Data>
              ],
          } as QueryResultIntersection<Data>;
        } else {
          resultMeta![reserved as keyof QueryResultIntersection<Data>];
        }
      });
      return {
        ...response.data,
        ref: response.ref,
        source: response.source,
        fetchTime: response.fetchTime,
        resultMeta
      };
    },
  });
}
