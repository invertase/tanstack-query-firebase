import {
  CreateMutationOptions,
  CreateMutationResult,
  CreateQueryOptions,
  CreateQueryResult,
  injectMutation,
  injectQuery,
  QueryClient,
  QueryKey,
} from "@tanstack/angular-query-experimental";
import {
  DataConnect,
  executeMutation,
  executeQuery,
  MutationRef,
  MutationResult,
  QueryRef,
  QueryResult,
} from "firebase/data-connect";
import { FirebaseError } from "firebase/app";

import { inject, signal } from "@angular/core";
function getQueryKey(queryRef: QueryRef<unknown, unknown>) {
  return [queryRef.name, queryRef.variables];
}
type FlattenedQueryResult<Data, Variables> = Omit<
  QueryResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;
interface CreateDataConnectQueryOptions<Data, Variables>
  extends Omit<
    CreateQueryOptions<
      FlattenedQueryResult<Data, Variables>,
      FirebaseError,
      FlattenedQueryResult<Data, Variables>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  > {
  queryFn: () => QueryRef<Data, Variables>;
}

/**
 * injectDataConnectQuery takes a query ref and returns a wrapper function around Tanstack's `injectQuery`
 * @param queryRefOrOptionsFn Query Ref or callback function for calling a new query
 * @returns {CreateQueryResult<FlattenedQueryResult<Data, Variables>>}
 */
export function injectDataConnectQuery<Data, Variables>(
  queryRefOrOptionsFn:
    | QueryRef<Data, Variables>
    | (() => CreateDataConnectQueryOptions<Data, Variables>)
): CreateQueryResult<FlattenedQueryResult<Data, Variables>, FirebaseError> {
  const queryKey = signal<QueryKey>([]);
  function fdcOptionsFn() {
    const passedInOptions =
      typeof queryRefOrOptionsFn === "function"
        ? queryRefOrOptionsFn()
        : undefined;

    const modifiedFn = () => {
      const ref: QueryRef<Data, Variables> =
        passedInOptions?.queryFn() ||
        (queryRefOrOptionsFn as QueryRef<Data, Variables>);
      queryKey.set([ref.name, ref.variables]);
      return executeQuery(ref).then((res) => {
        const { data, ...rest } = res;
        return {
          ...data,
          ...rest,
        };
      }) as Promise<FlattenedQueryResult<Data, Variables>>;
    };
    return {
      queryKey: queryKey(),
      ...passedInOptions,
      queryFn: modifiedFn,
    };
  }
  return injectQuery(fdcOptionsFn);
}

export type GeneratedSignature<Data, Variables> = (
  dc: DataConnect,
  vars: Variables
) => MutationRef<Data, Variables>;
export type DataConnectMutationOptionsFn<Data, Error, Variables, Arguments> =
  () => Omit<CreateMutationOptions<Data, Error, Arguments>, "mutationFn"> & {
    invalidate?: QueryKey | QueryRef<Data, Variables>[];
    dataConnect?: DataConnect;
    mutationFn: (args: Arguments) => MutationRef<Data, Variables>;
  };
export type DataConnectMutationOptionsUndefinedMutationFn<
  Data,
  Error,
  Variables
> = () => Omit<
  ReturnType<DataConnectMutationOptionsFn<Data, Error, Variables, Variables>>,
  "mutationFn"
>;
export type FlattenedMutationResult<Data, Variables> = Omit<
  MutationResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;

export function injectDataConnectMutation<Data, Variables, Arguments>(
  factoryFn: undefined,
  optionsFn: DataConnectMutationOptionsFn<
    Data,
    FirebaseError,
    Variables,
    Arguments
  >
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
>;
export function injectDataConnectMutation<
  Data,
  Variables extends undefined,
  Arguments = void | undefined
>(
  factoryFn: GeneratedSignature<Data, Variables>
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
>;
export function injectDataConnectMutation<Data, Variables, Arguments>(
  factoryFn: GeneratedSignature<Data, Variables>
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
>;
export function injectDataConnectMutation<Data, Variables, Arguments>(
  factoryFn: GeneratedSignature<Data, Variables>,
  optionsFn?: DataConnectMutationOptionsUndefinedMutationFn<
    Data,
    FirebaseError,
    Arguments
  >
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
>;
/**
 * injectDataConnectMutation takes a mutation ref factory function and returns a tanstack wrapper around `injectMutation`
 * @param factoryFn generated SDK factory function
 * @param optionsFn options function to create a new mutation
 * @returns {CreateMutationResult<FlattenedMutationResult<Data, Variables>, FirebaseError, Arguments>}
 */
export function injectDataConnectMutation<
  Data,
  Variables,
  Arguments extends Variables
>(
  factoryFn: GeneratedSignature<Data, Variables> | undefined,
  optionsFn?:
    | DataConnectMutationOptionsFn<Data, FirebaseError, Variables, Arguments>
    | DataConnectMutationOptionsUndefinedMutationFn<
        Data,
        FirebaseError,
        Variables
      >
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
> {
  const injectCb = () => {
    const queryClient = inject(QueryClient);
    const providedOptions = optionsFn ? optionsFn() : undefined;
    const modifiedFn = (args: Arguments) => {
      const dataConnect = inject(DataConnect);
      const ref =
        (providedOptions &&
          "mutationFn" in providedOptions &&
          providedOptions.mutationFn(args as Arguments)) ||
        factoryFn!(dataConnect, args as Variables);

      return executeMutation(ref)
        .then((res) => {
          const { data, ...rest } = res;
          return {
            ...data,
            ...rest,
          };
        })
        .then((ret) => {
          providedOptions?.invalidate?.forEach((qk) => {
            let key = qk;
            if ("name" in (qk as Object)) {
              const queryKey = getQueryKey(qk as QueryRef<unknown, unknown>);
              key = queryKey;
            }
            queryClient.invalidateQueries({
              queryKey: key,
            });
          });
          return ret;
        }) as Promise<FlattenedMutationResult<Data, Variables>>;
    };

    return {
      ...providedOptions,
      mutationFn: modifiedFn,
    };
  };
  return injectMutation(injectCb);
}
