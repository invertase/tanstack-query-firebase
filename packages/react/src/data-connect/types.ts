import type { MutationResult, QueryResult } from "firebase/data-connect";
export type FlattenedMResult<Data, Variables> = Omit<
  MutationResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;

export type FlattenedQResult<Data, Variables> = Omit<
  QueryResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data;
export type ReservedQueryKeys = keyof FlattenedQResult<unknown, unknown>;
export type ReservedMutationKeys = keyof FlattenedMResult<undefined, undefined>;
export type QueryResultIntersection<Data> = keyof Data &
  ReservedQueryKeys extends never
  ? undefined
  : {
      [key in keyof Data & ReservedQueryKeys]: Data[key];
    };
export type MutationResultIntersection<Data> = keyof Data &
  ReservedMutationKeys extends never
  ? undefined
  : {
      [key in keyof Data & ReservedMutationKeys]: Data[key];
    };

type QueryResultMeta<Data> = {
  resultMeta: QueryResultIntersection<Data>;
};
type MutationResultMeta<Data> = {
  resultMeta: MutationResultIntersection<Data>;
};

// Flattens a QueryResult data down into a single object.
// This is to prevent query.data.data, and also expose additional properties.
export type FlattenedQueryResult<Data, Variables> = Omit<
  QueryResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data & QueryResultMeta<Data>;

export type FlattenedMutationResult<Data, Variables> = Omit<
  MutationResult<Data, Variables>,
  "data" | "toJSON"
> &
  Data & MutationResultMeta<Data>;
export const RESERVED_OPERATION_FIELDS: ReservedQueryKeys[] = [
  "ref",
  "fetchTime",
  "source",
];