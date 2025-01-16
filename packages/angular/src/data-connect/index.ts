import { CreateMutationOptions, CreateMutationResult, CreateQueryOptions, injectMutation, injectQueries, injectQuery, QueryFunction, QueryKey, } from '@tanstack/angular-query-experimental';
import { executeMutation, executeQuery, MutationRef, QueryRef, type DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';
import { FlattenedMutationResult } from '../../../react/src/data-connect';
type DataConnectMutationOptions<Data, Error, Variables, Arguments> = CreateMutationOptions<Data, Error, Arguments> & {
    invalidate?: QueryKey | QueryRef<Data, Variables>[]
};

type MutationsOptionsFn<Data, Variables, Arguments = void> =  DataConnectMutationOptions<FlattenedMutationResult<Data, Variables>, FirebaseError, Variables, Arguments> & {
    dataConnect?: DataConnect;
};
export function injectDataConnectMutation<Data, Variables, Arguments = void>(
    mutationFn: (args: Arguments)  => MutationRef<Data, Variables>,
    optionsFn?: () => MutationsOptionsFn<Data, Variables, Arguments>
): CreateMutationResult<FlattenedMutationResult<Data, Variables>, FirebaseError, Arguments> {
    function fdcOptionsFn(): DataConnectMutationOptions<FlattenedMutationResult<Data, Variables>, FirebaseError, Variables, Arguments> {
        const modifiedFn = (args: Arguments) => {
                    const ref: MutationRef<Data, Variables> = mutationFn(args);
                    return executeMutation(ref).then(res => {
                        const { data, ...rest} = res;
                        return {
                            ...data,
                            ...rest
                        }
                    }) as Promise<FlattenedMutationResult<Data, Variables>>;
                };
        if(optionsFn) {
            const options = optionsFn();
            return {
                mutationFn: modifiedFn,
                ...options,
            }
        }
        return {
            mutationFn: modifiedFn
        }
    }
    return injectMutation(fdcOptionsFn);
}
interface CreateDataConnectQueryOptions<Data, Variables> extends Omit<CreateQueryOptions<Data, FirebaseError, QueryKey>, 'queryFn'> {
    queryFn: () => QueryRef<Data, Variables>
}
export function injectDataConnectQuery<Data, Variables>(
    optionsFn: () => CreateDataConnectQueryOptions<Data, Variables>
) {
    function fdcOptionsFn() {
        const options = optionsFn();
        const modifiedFn = () => {
                    const ref: QueryRef<Data, Variables> = options.queryFn();
                    return executeQuery(ref).then(res => {
                        const { data, ...rest} = res;
                        return {
                            ...data,
                            ...rest
                        }
                    }) as Promise<FlattenedMutationResult<Data, Variables>>;
                };
            
        return {
            ...options,
            queryFn: modifiedFn,
        }
    }
    return injectQuery(fdcOptionsFn);
}
