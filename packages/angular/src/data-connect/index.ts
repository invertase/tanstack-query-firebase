import {
  type CreateMutationOptions,
  type CreateMutationResult,
  type CreateQueryOptions,
  type CreateQueryResult,
  injectMutation,
  injectQuery,
  QueryClient,
  type QueryKey,
} from "@tanstack/angular-query-experimental";

import type { FirebaseError } from "firebase/app";

import {
  EnvironmentInjector,
  inject,
  type Injector,
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
export const RESERVED_OPERATION_FIELDS: (ReservedQueryKeys &
  ReservedMutationKeys)[] = ["ref", "fetchTime", "source"];
function getQueryKey(queryRef: QueryRef<unknown, unknown>) {
  const key: (string | Record<string, any>)[] = [queryRef.name];
  if ("variables" in queryRef && queryRef.variables !== undefined) {
    key.push(queryRef.variables as unknown as Record<string, any>);
  }
  return key;
}
type ReservedQueryKeys = keyof FlattenedQResult<unknown, unknown> & string;
type ReservedMutationKeys = keyof FlattenedMResult<undefined, undefined> &
  string;
type MutationIntersection<Data> = {
  [key in keyof Data & keyof FlattenedMResult<undefined, undefined>]: Data[key];
};
type QueryIntersection<Data> = {
  [key in keyof Data & keyof FlattenedQResult<undefined, undefined>]: Data[key];
};
type QueryResultIntersection<Data> = keyof Data &
  ReservedQueryKeys extends never
  ? undefined
  : QueryIntersection<Data>;
type MutationResultIntersection<Data> = keyof Data &
  ReservedMutationKeys extends never
  ? undefined
  : MutationIntersection<Data>;

type QueryResultMeta<Data> = {
  resultMeta: QueryResultIntersection<Data>;
};
type MutationResultMeta<Data> = {
  resultMeta: MutationResultIntersection<Data>;
};

// type ResultMeta<Data> = IntersectionKeys<Data, QueryResult<unknown, unknown>>;
export type FlattenedQResult<Data, Variables> = Omit<
  QueryResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;

export type FlattenedQueryResult<Data, Variables> = FlattenedQResult<
  Data,
  Variables
> &
  QueryResultMeta<Data>;
export interface CreateDataConnectQueryOptions<Data, Variables>
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
    | (() => CreateDataConnectQueryOptions<Data, Variables>),
  injector?: Injector,
  _callerSdkType: CallerSdkType = CallerSdkTypeEnum.TanstackAngularCore
): CreateQueryResult<FlattenedQueryResult<Data, Variables>, FirebaseError> {
  const finalInjector = injector || inject(EnvironmentInjector);
  const queryKey = signal<QueryKey>([]);

  function fdcOptionsFn() {
    const passedInOptions =
      typeof queryRefOrOptionsFn === "function"
        ? queryRefOrOptionsFn()
        : undefined;

    const modifiedFn = async (): Promise<
      FlattenedQueryResult<Data, Variables>
    > => {
      const ref: QueryRef<Data, Variables> =
        passedInOptions?.queryFn() ||
        (queryRefOrOptionsFn as QueryRef<Data, Variables>);
      // @ts-expect-error function is hidden under `DataConnect`.
      ref.dataConnect._setCallerSdkType(_callerSdkType);
      queryKey.set([ref.name, ref.variables]);
      const { data, ...rest } = await executeQuery(ref);
      let intersectionInfo: QueryIntersection<Data> =
        {} as QueryIntersection<Data>;
      RESERVED_OPERATION_FIELDS.forEach((reserved: ReservedQueryKeys) => {
        intersectionInfo![reserved as keyof QueryIntersection<Data> & string] =
          data[reserved as keyof QueryIntersection<Data> & string];
      });
      const resultMeta: QueryResultIntersection<Data> = (
        Object.keys(intersectionInfo).length ? intersectionInfo : undefined
      ) as QueryResultIntersection<Data>;
      return {
        ...data,
        ...rest,
        resultMeta,
      };
    };
    return {
      queryKey: queryKey(),
      ...passedInOptions,
      queryFn: modifiedFn,
    };
  }

  return injectQuery(fdcOptionsFn, finalInjector);
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
export type FlattenedMResult<Data, Variables> = Omit<
  MutationResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;
export type FlattenedMutationResult<Data, Variables> = FlattenedMResult<
  Data,
  Variables
> &
  MutationResultMeta<Data>;

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
  injector?: Injector,
  _callerSdkType: CallerSdkType = CallerSdkTypeEnum.TanstackAngularCore
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
> {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dataConnect = finalInjector.get(DataConnect);
  const queryClient = finalInjector.get(QueryClient);

  const injectCb = () => {
    const providedOptions = optionsFn?.();
    const modifiedFn = async (
      args: Arguments
    ): Promise<FlattenedMutationResult<Data, Variables>> => {
      const ref =
        (providedOptions &&
          "mutationFn" in providedOptions! &&
          providedOptions!.mutationFn(args)) ||
        factoryFn!(dataConnect, args as Variables);
      // @ts-expect-error function is hidden under `DataConnect`.
      ref.dataConnect._setCallerSdkType(_callerSdkType);
      const { data, ...rest } = await executeMutation(ref);
      let intersectionInfo: MutationIntersection<Data> =
        {} as MutationIntersection<Data>;
      RESERVED_OPERATION_FIELDS.forEach((reserved: ReservedMutationKeys) => {
        intersectionInfo![
          reserved as keyof MutationIntersection<Data> & string
        ] = data[reserved as keyof MutationIntersection<Data> & string];
      });
      const resultMeta: MutationResultIntersection<Data> = (
        Object.keys(intersectionInfo).length ? intersectionInfo : undefined
      ) as MutationResultIntersection<Data>;
      const ret: FlattenedMutationResult<Data, Variables> = {
        ...data,
        ...rest,
        resultMeta,
      };

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
      return ret;
    };

    return {
      ...providedOptions,
      mutationFn: modifiedFn,
    };
  };

  return injectMutation(injectCb, finalInjector);
}
