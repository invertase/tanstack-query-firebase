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

import { FirebaseError } from "firebase/app";

import { inject, signal } from "@angular/core";
import {
  CallerSdkType,
  CallerSdkTypeEnum,
  DataConnect,
  executeMutation,
  executeQuery,
  MutationRef,
  MutationResult,
  QueryRef,
  QueryResult,
} from "@angular/fire/data-connect";
function getQueryKey(queryRef: QueryRef<unknown, unknown>) {
  const key: (string | Record<string, any>)[] = [queryRef.name];
  if ("variables" in queryRef && queryRef.variables !== undefined) {
    key.push(queryRef.variables as unknown as Record<string, any>);
  }
  return key;
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
    | QueryRef<Data, Variables>
    | (() => CreateDataConnectQueryOptions<Data, Variables>),
  _callerSdkType: CallerSdkType = CallerSdkTypeEnum.TanstackReactCore
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
      // @ts-expect-error function is hidden under `DataConnect`.
      ref.dataConnect._setCallerSdkType(_callerSdkType);
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
) => MutationRef<Data, Variables>; // TODO(mtewani): Add __angular: true
export type DataConnectMutationOptionsFn<Data, Error, Variables, Arguments> =
  () => Omit<CreateMutationOptions<Data, Error, Arguments>, "mutationFn"> & {
    invalidate?: QueryKey | QueryRef<unknown, unknown>[];
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

type EmptyFactoryFn<Data, Variables> = () => MutationRef<Data, Variables>;
export function injectDataConnectMutation<Data, Variables, Arguments>(
  factoryFn: undefined | null,
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
  Variables,
  Arguments = void | undefined
>(
  factoryFn: EmptyFactoryFn<Data, Variables>,
  options?: DataConnectMutationOptionsUndefinedMutationFn<
    Data,
    FirebaseError,
    Variables
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
  factoryFn: EmptyFactoryFn<Data, Variables>,
  options?: DataConnectMutationOptionsUndefinedMutationFn<
    Data,
    FirebaseError,
    Variables
  >
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
>;
export function injectDataConnectMutation<
  Data,
  Variables extends undefined,
  Arguments = Variables
>(
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
export function injectDataConnectMutation<
  Data,
  Variables,
  Arguments extends Variables
>(
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
// TODO(mtewani): Just check for the fact that the user has passed in a generated Angular fn. AKA __angular: true
/**
 * injectDataConnectMutation takes a mutation ref factory function and returns a tanstack wrapper around `injectMutation`
 * @example injectDataConnectMutation(createMovieRef);
 * @param factoryFn generated SDK factory function
 * @param optionsFn options function to create a new mutation
 * @returns {CreateMutationResult<FlattenedMutationResult<Data, Variables>, FirebaseError, Arguments>}
 */
export function injectDataConnectMutation<
  Data,
  Variables,
  Arguments extends Variables
>(
  factoryFn:
    | GeneratedSignature<Data, Variables>
    | EmptyFactoryFn<Data, Variables>
    | undefined
    | null,
  optionsFn?:
    | DataConnectMutationOptionsFn<Data, FirebaseError, Variables, Arguments>
    | DataConnectMutationOptionsUndefinedMutationFn<
        Data,
        FirebaseError,
        Variables
      >,
  _callerSdkType: CallerSdkType = CallerSdkTypeEnum.TanstackReactCore
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
> {
  const dataConnect = inject(DataConnect);
  const queryClient = inject(QueryClient);

  const injectCb = () => {
    const providedOptions = optionsFn && optionsFn();
    const modifiedFn = (args: Arguments) => {
      const ref =
        (providedOptions &&
          "mutationFn" in providedOptions! &&
          providedOptions!.mutationFn(args)) ||
        factoryFn!(dataConnect, args as Variables);
      // @ts-expect-error function is hidden under `DataConnect`.
      ref.dataConnect._setCallerSdkType(_callerSdkType);
      return executeMutation(ref)
        .then((res) => {
          const { data, ...rest } = res;
          return {
            ...data,
            ...rest,
          };
        })
        .then((ret) => {
          if (providedOptions?.invalidate) {
            for (const qk of providedOptions.invalidate) {
              let key = qk;
              if ("name" in (key as Object)) {
                const queryKey = getQueryKey(key as QueryRef<unknown, unknown>);
                key = queryKey;
                if (
                  key &&
                  "variables" in (qk as Object) &&
                  (qk as QueryRef<unknown, unknown>).variables !== undefined
                ) {
                  queryClient.invalidateQueries({
                    queryKey: key,
                    exact: true,
                  });
                } else {
                  queryClient.invalidateQueries({
                    queryKey: key,
                  });
                }
              }
            }
          }
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
