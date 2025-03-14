import type {
  MutationResult,
  QueryResult,
} from "firebase/data-connect";
import type { FirebaseError } from "firebase/app";
import {
  CreateMutationResult,
  CreateQueryResult,
} from "@tanstack/angular-query-experimental";
import type { Signal } from "@angular/core";

export type CreateDataConnectQueryResult<Data, Variables> = CreateQueryResult<Data, FirebaseError> & {
  dataConnectResult: Signal<Partial<QueryResult<Data, Variables>> | undefined>,
};

export type CreateDataConnectMutationResult<Data, Variables, Arguments> =
  CreateMutationResult<Data, FirebaseError, Arguments> & {
    dataConnectResult: Signal<Partial<MutationResult<Data, Variables>> | undefined>
  };
