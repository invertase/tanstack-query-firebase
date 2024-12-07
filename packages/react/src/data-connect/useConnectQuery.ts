import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type FirebaseError } from "firebase/app";
import {
  type QueryRef,
  type QueryResult,
  executeQuery,
} from "firebase/data-connect";

type UseConnectQueryOptions<TData = unknown, TError = FirebaseError> = Omit<
  UseQueryOptions<TData, TError>,
  "queryFn"
>;

export function useConnectQuery<
  Data extends Record<string, any>,
  Variables = unknown
>(
  refOrResult: QueryRef<Data, Variables> | QueryResult<Data, Variables>,
  options?: UseConnectQueryOptions<Data, FirebaseError>
) {
  let queryRef: QueryRef<Data, Variables>;
  let initialData: Data | undefined;

  if ("ref" in refOrResult) {
    queryRef = refOrResult.ref;
    initialData = refOrResult.data;
  } else {
    queryRef = refOrResult;
  }

  return useQuery<Data, FirebaseError>({
    initialData,
    ...options,
    queryKey: options?.queryKey ?? [queryRef.name, queryRef.variables],
    queryFn: async () => {
      const { data } = await executeQuery<Data, Variables>(queryRef);
      return data;
    },
  });
}
