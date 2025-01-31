import type { MutationResult, QueryResult } from "firebase/data-connect";

// Flattens a QueryResult data down into a single object.
// This is to prevent query.data.data, and also expose additional properties.
export type FlattenedQueryResult<Data, Variables> = Omit<
  QueryResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;

export type FlattenedMutationResult<Data, Variables> = Omit<
  MutationResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;

export enum CallerSdkType {
  Base, // Core JS SDK
  Generated, // Generated JS SDK
  TanstackReactCore, // Tanstack non-generated React SDK
  GeneratedReact, // Generated React SDK
  TanstackAngularCore, // Tanstack non-generated Angular SDK
  GeneratedAngular // Generated Angular SDK
}