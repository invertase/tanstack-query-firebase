import {
  type UseMutationOptions,
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import {
  type DataConnect,
  type MutationRef,
  type QueryRef,
  executeMutation,
} from "firebase/data-connect";
import { isQueryKey, type FlattenedMutationResult } from "./types";

export type useDataConnectMutationOptions<
  TData = unknown,
  TError = FirebaseError,
  Variables = unknown
> = Omit<UseMutationOptions<TData, TError, Variables>, "mutationFn"> & {
  invalidate?: ReadonlyArray<
    QueryRef<unknown, unknown> | (() => QueryRef<unknown, unknown>) | QueryKey
  >;
};

export function useDataConnectMutation<
  Fn extends (...args: any[]) => MutationRef<any, any>,
  Data = ReturnType<Fn> extends MutationRef<infer D, any> ? D : never,
  Variables = Fn extends (
    dc: DataConnect,
    vars: infer V
  ) => MutationRef<any, any>
    ? V
    : Fn extends (vars: infer V) => MutationRef<any, any>
    ? V
    : never
>(
  ref: Fn,
  options?: useDataConnectMutationOptions<
    FlattenedMutationResult<Data, Variables>,
    FirebaseError,
    Variables
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    FlattenedMutationResult<Data, Variables>,
    FirebaseError,
    Variables
  >({
    ...options,
    onSuccess(...args) {
      if (options?.invalidate?.length) {
        for (const ref of options.invalidate) {
          if ("variables" in ref && ref.variables !== undefined) {
            queryClient.invalidateQueries({
              queryKey: [ref.name, ref.variables],
              exact: true,
            });
          } else if (isQueryKey(ref)) {
            queryClient.invalidateQueries({
              queryKey: ref,
            });
          } else {
            queryClient.invalidateQueries({
              queryKey: [ref.name],
            });
          }
        }
      }

      options?.onSuccess?.(...args);
    },
    mutationFn: async (variables) => {
      const response = await executeMutation<Data, Variables>(ref(variables));

      return {
        ...response.data,
        ref: response.ref,
        source: response.source,
        fetchTime: response.fetchTime,
      };
    },
  });
}
