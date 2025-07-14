import {
  type FetchQueryOptions,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import {
  executeQuery,
  type QueryRef,
  type QueryResult,
} from "firebase/data-connect";

export type DataConnectQueryOptions<Data, Variables> = Omit<
  FetchQueryOptions<Data, FirebaseError, Data, QueryKey>,
  "queryFn" | "queryKey"
> & {
  queryRef: QueryRef<Data, Variables>;
  queryKey?: QueryKey;
};

export class DataConnectQueryClient extends QueryClient {
  prefetchDataConnectQuery<Data extends Record<string, any>, Variables>(
    refOrResult: QueryRef<Data, Variables> | QueryResult<Data, Variables>,
    options?: DataConnectQueryOptions<Data, Variables>,
  ) {
    let queryRef: QueryRef<Data, Variables>;
    let initialData: Data | undefined;

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

    return this.prefetchQuery<Data, FirebaseError, Data, QueryKey>({
      ...options,
      initialData,
      queryKey: options?.queryKey ?? [
        queryRef.name,
        queryRef.variables || null,
      ],
      queryFn: async () => {
        const response = await executeQuery(queryRef);

        const data = {
          ...response.data,
          ref: response.ref,
          source: response.source,
          fetchTime: response.fetchTime,
        };

        // Ensures no serialization issues with undefined values
        return JSON.parse(JSON.stringify(data));
      },
    });
  }
}
