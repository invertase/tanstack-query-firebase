import type { Signal } from "@angular/core";
import type {
  CreateMutationResult,
  CreateQueryResult,
} from "@tanstack/angular-query-experimental";
import type { FirebaseError } from "firebase/app";
import type { MutationResult, QueryResult } from "firebase/data-connect";

export type CreateDataConnectQueryResult<Data, Variables> = CreateQueryResult<
  Data,
  FirebaseError
> & {
  dataConnectResult: Signal<Partial<QueryResult<Data, Variables>> | undefined>;
};

export type CreateDataConnectMutationResult<Data, Variables, Arguments> =
  CreateMutationResult<Data, FirebaseError, Arguments> & {
    dataConnectResult: Signal<
      Partial<MutationResult<Data, Variables>> | undefined
    >;
  };
