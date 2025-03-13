import type { MutationResult, QueryResult } from "firebase/data-connect";
export type ReservedQueryKeys = keyof FlattenedQResult<unknown, unknown> & string;
export type ReservedMutationKeys = keyof FlattenedMResult<undefined, undefined> &
  string;
export type MutationIntersection<Data> = {
  [key in keyof Data & keyof FlattenedMResult<undefined, undefined>]: Data[key];
};
export type QueryIntersection<Data> = {
  [key in keyof Data & keyof FlattenedQResult<undefined, undefined>]: Data[key];
};
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
export type QueryResultIntersection<Data> = keyof Data &
  ReservedQueryKeys extends never
  ? undefined
  : QueryIntersection<Data>;
export type MutationResultIntersection<Data> = keyof Data &
  ReservedMutationKeys extends never
  ? undefined
  : MutationIntersection<Data>;

export type QueryResultMeta<Data> = {
  resultMeta: QueryResultIntersection<Data>;
};
export type MutationResultMeta<Data> = {
  resultMeta: MutationResultIntersection<Data>;
};

// Flattens a QueryResult data down into a single object.
// This is to prevent query.data.data, and also expose additional properties.

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

export const RESERVED_OPERATION_FIELDS: ReservedQueryKeys[] = [
  "ref",
  "fetchTime",
  "source",
];