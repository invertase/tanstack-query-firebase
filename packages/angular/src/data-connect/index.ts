import {
  CreateMutationOptions,
  CreateMutationResult,
  CreateQueryOptions,
  CreateQueryResult,
  injectMutation,
  injectQueries,
  injectQuery,
  QueryClient,
  QueryKey,
} from "@tanstack/angular-query-experimental";
import {
  executeMutation,
  executeQuery,
  MutationRef,
  QueryRef,
  type DataConnect,
} from "firebase/data-connect";
import { FirebaseError } from "firebase/app";
import {
  FlattenedMutationResult,
  FlattenedQueryResult,
} from "../../../react/src/data-connect";
import { assertInInjectionContext, inject, signal } from "@angular/core";
function getQueryKey(queryRef: QueryRef<unknown, unknown>) {
    return [
        queryRef.name,
        queryRef.variables
    ]
}
type DataConnectMutationOptions<Data, Error, Variables, Arguments> =
  CreateMutationOptions<Data, Error, Arguments> & {
    invalidate?: QueryKey | QueryRef<Data, Variables>[];
  };

type MutationsOptionsFn<
  Data,
  Variables,
  Arguments = void
> = DataConnectMutationOptions<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Variables,
  Arguments
> & {
  dataConnect?: DataConnect;
};
export function injectDataConnectMutation<Data, Variables, Arguments = void>(
  mutationFn: (args: Arguments) => MutationRef<Data, Variables>,
  optionsFn?: () => MutationsOptionsFn<Data, Variables, Arguments>
): CreateMutationResult<
  FlattenedMutationResult<Data, Variables>,
  FirebaseError,
  Arguments
> {
  const fdcOptionsFn: () => DataConnectMutationOptions<
    FlattenedMutationResult<Data, Variables>,
    FirebaseError,
    Variables,
    Arguments
  > = () =>  {
    const queryClient = inject(QueryClient);
    const modifiedFn = (args: Arguments, options?: MutationsOptionsFn<Data, Variables, Arguments>) => {
      const ref: MutationRef<Data, Variables> = mutationFn(args);
      const keys = options?.invalidate?.map(qk => {
        let key = qk;
        if('name' in (qk as Object)) {
            const queryKey = getQueryKey((qk as QueryRef<unknown, unknown>));
            console.log(queryKey);
            key = queryKey;
        }
        queryClient.invalidateQueries({ queryKey: key});
      });
      return executeMutation(ref).then((res) => {
        const { data, ...rest } = res;
        return {
          ...data,
          ...rest,
        };
      }) as Promise<FlattenedMutationResult<Data, Variables>>;
    };
    if (optionsFn) {
      const options = optionsFn();
      return {
        mutationFn: (args: Arguments) => {
            return modifiedFn(args, options);
        },
        ...options,
      };
    }
    return {
      mutationFn: modifiedFn,
    };
  }
  return injectMutation(fdcOptionsFn);
}
interface CreateDataConnectQueryOptions<Data, Variables>
  extends Omit<
    CreateQueryOptions<
      FlattenedQueryResult<Data, Variables>,
      FirebaseError,
      FlattenedQueryResult<Data, Variables>,
      QueryKey
    >,
    "queryFn"|
    "queryKey"
  > {
  queryFn: () => QueryRef<Data, Variables>;
}
export function injectDataConnectQuery<Data, Variables>(
  optionsFn: () => CreateDataConnectQueryOptions<Data, Variables>
): CreateQueryResult<FlattenedQueryResult<Data, Variables>, FirebaseError> {
  const queryKey = signal<QueryKey>([])
  function fdcOptionsFn()  {
    const options = optionsFn();
    const modifiedFn = () => {
      const ref: QueryRef<Data, Variables> = options.queryFn();
      queryKey.set([ref.name, ref.variables])
      console.log(queryKey());
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
      ...options,
      queryFn: modifiedFn,
    };
  }
  return injectQuery(fdcOptionsFn);
}
