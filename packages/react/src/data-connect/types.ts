import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { FirebaseError } from "firebase/app";
import type { MutationResult, QueryResult } from "firebase/data-connect";

export type QueryResultRequiredRef<Data, Variables> = Partial<
  QueryResult<Data, Variables>
> &
  Required<Pick<QueryResult<Data, Variables>, "ref">>;

export type UseDataConnectQueryResult<Data, Variables> = UseQueryResult<
  Data,
  FirebaseError
> & {
  dataConnectResult?: QueryResultRequiredRef<Data, Variables>;
};

export type UseDataConnectMutationResult<Data, Variables> = UseMutationResult<
  Data,
  FirebaseError,
  Variables
> & {
  dataConnectResult?: Partial<MutationResult<Data, Variables>>;
};
