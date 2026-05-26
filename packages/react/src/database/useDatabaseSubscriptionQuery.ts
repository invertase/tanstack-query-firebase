import { useQuery } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import type {
  DataSnapshot,
  ListenOptions,
  Query,
  Unsubscribe,
} from "firebase/database";
import {
  createDatabaseSubscriptionQueryFn,
  databaseSubscriptionQueryDefaults,
} from "./createSubscriptionQueryFn";
import type { DatabaseUseQueryOptions } from "./types";

type SubscribeToQuery = (
  query: Query,
  onNext: (snapshot: DataSnapshot) => void,
  onError: (error: Error) => void,
  options?: ListenOptions,
) => Unsubscribe;

export function useDatabaseSubscriptionQuery(
  query: Query,
  subscribeToQuery: SubscribeToQuery,
  options: DatabaseUseQueryOptions<DataSnapshot, FirebaseError>,
) {
  const { database: listenOptions, ...queryOptions } = options;

  return useQuery<DataSnapshot, FirebaseError>({
    ...databaseSubscriptionQueryDefaults,
    ...queryOptions,
    queryFn: createDatabaseSubscriptionQueryFn((handlers) =>
      subscribeToQuery(query, handlers.onNext, handlers.onError, listenOptions),
    ),
  });
}
