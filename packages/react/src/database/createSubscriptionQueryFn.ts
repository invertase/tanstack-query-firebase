import type { QueryFunction, QueryFunctionContext } from "@tanstack/react-query";
import type { Unsubscribe } from "firebase/database";

type ListenerHandlers<TData> = {
  onNext: (data: TData) => void;
  onError: (error: Error) => void;
};

/**
 * Wraps a Firebase Realtime Database listener in a TanStack Query `queryFn`.
 *
 * - Resolves the initial fetch promise on the first snapshot.
 * - Pushes subsequent snapshots into the cache via `setQueryData`.
 * - Unsubscribes when the query fetch is aborted (unmount / cancel).
 */
export function createDatabaseSubscriptionQueryFn<TData>(
  subscribe: (handlers: ListenerHandlers<TData>) => Unsubscribe,
): QueryFunction<TData> {
  return (context: QueryFunctionContext) => {
    const { client, queryKey, signal } = context;
    let firstRun = true;

    return new Promise<TData>((resolve, reject) => {
      const unsubscribe = subscribe({
        onNext: (data) => {
          if (firstRun) {
            firstRun = false;
            resolve(data);
            return;
          }
          client.setQueryData(queryKey, data);
        },
        onError: (error) => {
          if (firstRun) {
            firstRun = false;
            reject(error);
            return;
          }
          client.invalidateQueries({ queryKey });
        },
      });

      signal.addEventListener(
        "abort",
        () => {
          unsubscribe();
        },
        { once: true },
      );
    });
  };
}

export const databaseSubscriptionQueryDefaults = {
  staleTime: Number.POSITIVE_INFINITY,
  refetchOnMount: "always" as const,
};
