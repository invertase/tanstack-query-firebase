import type {
  MutationResult,
  QueryResult,
} from "firebase/data-connect";
import type { FirebaseError } from "firebase/app";
import {
  CreateMutationResult,
  CreateQueryResult,
} from "@tanstack/angular-query-experimental";

export type ResultDataOmitted<T> = Omit<T, "data">;

export type CreateDataConnectQueryResult<Data, Variables> = Exclude<
  CreateQueryResult<Data, FirebaseError>,
  keyof ResultDataOmitted<Partial<QueryResult<Data, Variables>>>
> &
  ResultDataOmitted<Partial<QueryResult<Data, Variables>>> & {
    originalResult: CreateQueryResult<Data, FirebaseError>;
  };

export type CreateDataConnectMutationResult<Data, Variables, Arguments> =
  Exclude<
    CreateMutationResult<Data, FirebaseError, Arguments>,
    keyof ResultDataOmitted<Partial<MutationResult<Data, Variables>>>
  > &
    ResultDataOmitted<Partial<MutationResult<Data, Variables>>> & {
      originalResult: CreateMutationResult<Data, FirebaseError, Arguments>;
    };
