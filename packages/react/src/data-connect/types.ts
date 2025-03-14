import type { MutationResult, QueryRef, QueryResult } from "firebase/data-connect";
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { FirebaseError } from "firebase/app";

// This is to prevent mutation.data.data, and also expose additional properties.

export type QueryResultRequiredRef<Data, Variables> = Omit<Partial<QueryResult<Data, Variables>> & Required<Pick<QueryResult<Data, Variables>, 'ref'>>, 'data'>;

export type UseDataConnectQuery<Data, Variables> =  Exclude<
  UseQueryResult<Data, FirebaseError>,
  keyof QueryResult<Data, Variables>
> &
  QueryResultRequiredRef<Data, Variables> & {
  originalResult: UseQueryResult<Data, FirebaseError>;
};

export type UseDataConnectMutation<Data, Variables> =  Exclude<
  UseMutationResult<Data, FirebaseError, Variables>,
  keyof MutationResult<Data, Variables>
> &
  Partial<MutationResult<Data, Variables>> & {
  originalResult: UseMutationResult<Data, FirebaseError, Variables>;
};
