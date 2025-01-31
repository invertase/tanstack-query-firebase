import {
  type UseMutationOptions,
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
import { CallerSdkType, type FlattenedMutationResult } from "./types";

export type useDataConnectMutationOptions<
  TData = unknown,
  TError = FirebaseError,
  Variables = unknown
> = Omit<UseMutationOptions<TData, TError, Variables>, "mutationFn"> & {
  invalidate?: ReadonlyArray<
    QueryRef<unknown, unknown> | (() => QueryRef<unknown, unknown>)
  >;
};

export function useDataConnectMutation<
  Fn extends
    | (() => MutationRef<any, any>)
    | ((vars: any) => MutationRef<any, any>),
  Data = ReturnType<
    Fn extends (() => MutationRef<infer D, any>)
      ? () => MutationRef<D, any>
      : Fn extends (vars: any) => MutationRef<infer D, any>
      ? (vars: any) => MutationRef<D, any>
      : Fn
  > extends MutationRef<infer D, any>
    ? D
    : never,
  Variables = Fn extends () => MutationRef<any, any>
    ? void
    : Fn extends (vars: infer V) => MutationRef<any, any>
    ? V
    : Fn extends (dc: DataConnect, vars: infer V) => MutationRef<any, any>
    ? V
    : never
>(
  ref: Fn,
  options?: useDataConnectMutationOptions<
    FlattenedMutationResult<Data, Variables>,
    FirebaseError,
    Variables
  >,
  _callerSdkType: CallerSdkType = CallerSdkType.TanstackReactCore
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
      const mutationRef = typeof ref === "function" ? ref(variables) : ref;

      // @ts-expect-error function is hidden under `DataConnect`.
      mutationRef.dataConnect._setCallerSdkType(_callerSdkType);
      const response = await executeMutation<Data, Variables>(mutationRef);

      return {
        ...response.data,
        ref: response.ref,
        source: response.source,
        fetchTime: response.fetchTime,
      };
    },
  });
}
