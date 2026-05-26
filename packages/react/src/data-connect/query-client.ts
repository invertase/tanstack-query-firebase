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
      initialData = JSON.parse(JSON.stringify(refOrResult.data));
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

        // Only serialize query data. Firebase v12 QueryRef objects are circular.
        return JSON.parse(JSON.stringify(response.data));
      },
    });
  }
}
