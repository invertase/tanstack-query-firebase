import {
  EnvironmentInjector,
  type Injector,
  inject,
  signal,
} from "@angular/core";
import {
  type CallerSdkType,
  CallerSdkTypeEnum,
  DataConnect,
  executeMutation,
  executeQuery,
  type MutationRef,
  type MutationResult,
  type QueryRef,
  type QueryResult,
} from "@angular/fire/data-connect";
import {
  type CreateMutationOptions,
  type CreateQueryOptions,
  injectMutation,
  injectQuery,
  QueryClient,
  type QueryKey,
} from "@tanstack/angular-query-experimental";
import type { FirebaseError } from "firebase/app";
import type {
  CreateDataConnectMutationResult,
  CreateDataConnectQueryResult,
} from "./types";

function getQueryKey(queryRef: QueryRef<unknown, unknown>) {
  const key: (string | Record<string, any>)[] = [queryRef.name];
  if ("variables" in queryRef && queryRef.variables !== undefined) {
    key.push(queryRef.variables as unknown as Record<string, any>);
  }
  return key;
}
export interface CreateDataConnectQueryOptions<Data, Variables>
  extends Omit<
    CreateQueryOptions<Data, FirebaseError, Data, QueryKey>,
    "queryFn" | "queryKey"
  > {
  queryFn: () => QueryRef<Data, Variables>;
}

/**
 * injectDataConnectQuery takes a query ref and returns a wrapper function around Tanstack's `injectQuery`
 * @param queryRefOrOptionsFn Query Ref or callback function for calling a new query
 * @returns {CreateDataConnectQueryResult<Data, Variables>}
 */
export function injectDataConnectQuery<Data, Variables>(
  queryRefOrOptionsFn:
    | QueryRef<Data, Variables>
    | (() => CreateDataConnectQueryOptions<Data, Variables>),
  injector?: Injector,
  _callerSdkType: CallerSdkType = CallerSdkTypeEnum.TanstackAngularCore,
): CreateDataConnectQueryResult<Data, Variables> {
  const dataConnectResult = signal<
    Partial<QueryResult<Data, Variables>> | undefined
  >(undefined);
  const finalInjector = injector || inject(EnvironmentInjector);
  const queryKey = signal<QueryKey>([]);

  function fdcOptionsFn() {
    const passedInOptions =
      typeof queryRefOrOptionsFn === "function"
        ? queryRefOrOptionsFn()
        : undefined;

    const modifiedFn = async (): Promise<Data> => {
      const ref: QueryRef<Data, Variables> =
        passedInOptions?.queryFn() ||
        (queryRefOrOptionsFn as QueryRef<Data, Variables>);
      dataConnectResult.set({ ref });
      // @ts-expect-error function is hidden under `DataConnect`.
      ref.dataConnect._setCallerSdkType(_callerSdkType);
      queryKey.set([ref.name, ref.variables]);
      const response = await executeQuery(ref);
      dataConnectResult.set(response);
      return response.data;
    };
    return {
      queryKey: queryKey(),
      ...passedInOptions,
      queryFn: modifiedFn,
    };
  }

  const originalResult = injectQuery(fdcOptionsFn, finalInjector);
  return {
    ...originalResult,
    dataConnectResult,
  };
}

export type GeneratedSignature<Data, Variables> = (
  dc: DataConnect,
  vars: Variables,
) => MutationRef<Data, Variables>;
export type DataConnectMutationOptionsFn<Data, Error, Variables, Arguments> =
  () => Omit<CreateMutationOptions<Data, Error, Arguments>, "mutationFn"> & {
    invalidate?: QueryKey | QueryRef<unknown, unknown>[];
    dataConnect?: DataConnect;
    mutationFn: (args: Arguments) => MutationRef<Data, Variables>;
  };
export type DataConnectMutationOptionsUndefinedMutationFn<
  Data,
  Error,
  Variables,
> = () => Omit<
  ReturnType<DataConnectMutationOptionsFn<Data, Error, Variables, Variables>>,
  "mutationFn"
>;

type EmptyFactoryFn<Data, Variables> = () => MutationRef<Data, Variables>;
export function injectDataConnectMutation<Data, Variables, Arguments>(
  factoryFn: undefined | null,
  optionsFn: DataConnectMutationOptionsFn<
    Data,
    FirebaseError,
    Variables,
    Arguments
  >,
): CreateDataConnectMutationResult<Data, FirebaseError, Arguments>;
export function injectDataConnectMutation<
  Data,
  Variables,
  Arguments = void | undefined,
>(
  factoryFn: EmptyFactoryFn<Data, Variables>,
  options?: DataConnectMutationOptionsUndefinedMutationFn<
    Data,
    FirebaseError,
    Variables
  >,
): CreateDataConnectMutationResult<Data, FirebaseError, Arguments>;

export function injectDataConnectMutation<
  Data,
  Variables extends undefined,
  Arguments = void | undefined,
>(
  factoryFn: EmptyFactoryFn<Data, Variables>,
  options?: DataConnectMutationOptionsUndefinedMutationFn<
    Data,
    FirebaseError,
    Variables
  >,
): CreateDataConnectMutationResult<Data, FirebaseError, Arguments>;
export function injectDataConnectMutation<
  Data,
  Variables extends undefined,
  Arguments = Variables,
>(
  factoryFn: GeneratedSignature<Data, Variables>,
  optionsFn?: DataConnectMutationOptionsUndefinedMutationFn<
    Data,
    FirebaseError,
    Arguments
  >,
): CreateDataConnectMutationResult<Data, FirebaseError, Arguments>;
export function injectDataConnectMutation<
  Data,
  Variables,
  Arguments extends Variables,
>(
  factoryFn: GeneratedSignature<Data, Variables>,
  optionsFn?: DataConnectMutationOptionsUndefinedMutationFn<
    Data,
    FirebaseError,
    Arguments
  >,
): CreateDataConnectMutationResult<Data, FirebaseError, Arguments>;
/**
 * injectDataConnectMutation takes a mutation ref factory function and returns a tanstack wrapper around `injectMutation`
 * @example injectDataConnectMutation(createMovieRef);
 * @param factoryFn generated SDK factory function
 * @param optionsFn options function to create a new mutation
 * @returns {CreateDataConnectMutationResult<Data, Variables, Arguments>}
 */
export function injectDataConnectMutation<
  Data,
  Variables,
  Arguments extends Variables,
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
  injector?: Injector,
  _callerSdkType: CallerSdkType = CallerSdkTypeEnum.TanstackAngularCore,
): CreateDataConnectMutationResult<Data, Variables, Arguments> {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dataConnect = finalInjector.get(DataConnect);
  const queryClient = finalInjector.get(QueryClient);
  const dataConnectResult = signal<
    Partial<MutationResult<Data, Variables>> | undefined
  >(undefined);

  const injectCb = () => {
    const providedOptions = optionsFn?.();
    const modifiedFn = async (args: Arguments): Promise<Data> => {
      const ref =
        (providedOptions &&
          "mutationFn" in providedOptions! &&
          providedOptions!.mutationFn(args)) ||
        factoryFn!(dataConnect, args as Variables);
      dataConnectResult.update((val) => ({
        ...val,
        ref,
      }));
      // @ts-expect-error function is hidden under `DataConnect`.
      ref.dataConnect._setCallerSdkType(_callerSdkType);
      const response = await executeMutation(ref);

      if (providedOptions?.invalidate) {
        for (const qk of providedOptions.invalidate) {
          let key = qk;
          if ("name" in (key as object)) {
            const queryKey = getQueryKey(key as QueryRef<unknown, unknown>);
            key = queryKey;
            const exact =
              "variables" in (qk as object) &&
              (qk as QueryRef<unknown, unknown>).variables !== undefined;
            queryClient.invalidateQueries({
              queryKey: key,
              exact,
            });
          }
        }
      }
      dataConnectResult.set(response);
      return response.data;
    };

    return {
      ...providedOptions,
      mutationFn: modifiedFn,
    };
  };

  const originalResult = injectMutation(injectCb, finalInjector);
  return {
    ...originalResult,
    dataConnectResult,
  };
}
