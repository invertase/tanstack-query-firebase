import type { MutationResult, OpResult, QueryResult } from "firebase/data-connect";

// Reserved keys such as ref, source, fetchtime
export type ReservedQueryKeys = keyof FlattenedQueryData<undefined, QueryResult<undefined, undefined>> & string;

// If there are no reserved fields used, the Meta type should be undefined.
export type QueryResultMeta<Data> = keyof Data &
  ReservedQueryKeys extends never
  ? undefined
  : QueryResultMetaObject<Data>;

// Result Meta Object storing all reserved fields.
export type QueryResultMetaObject<Data> = {
  [key in keyof Data & ReservedQueryKeys]: Data[key];
};

export type FlattenedQueryData<Data, Variables> = FlattenData<Data, QueryResult<Data, Variables>>;

export type FlattenData<Data,  OperationResult extends OpResult<Data>> = Omit<OperationResult, 'data' | 'toJSON'> & Data;

// Flattens a QueryResult data down into a single object.
// This is to prevent query.data.data, and also expose additional properties.
export type FlattenedQueryResult<Data, Variables> = FlattenedQueryData<
  Data,
  Variables
> & {
  resultMeta: QueryResultMeta<Data>
}

// Reserved keys such as ref, source, fetchtime
export type ReservedMutationKeys = keyof FlattenedMutationData<undefined, MutationResult<undefined, undefined>> & string;

// If there are no reserved fields used, the Meta type should be undefined.
export type MutationResultMeta<Data> = keyof Data &
  ReservedMutationKeys extends never
  ? undefined
  : MutationResultMetaObject<Data>;

// Result Meta Object storing all reserved fields.
export type MutationResultMetaObject<Data> = {
  [key in keyof Data & ReservedMutationKeys]: Data[key];
};

export type FlattenedMutationData<Data, Variables> = FlattenData<Data, MutationResult<Data, Variables>>;

// Flattens a MutationResult data down into a single object.
// This is to prevent mutation.data.data, and also expose additional properties.
export type FlattenedMutationResult<Data, Variables> = FlattenedMutationData<
  Data,
  Variables
> & {
  resultMeta: QueryResultMeta<Data>
}

export const RESERVED_QUERY_FIELDS: ReservedQueryKeys[] = [
  "ref",
  "fetchTime",
  "source",
  'asdf'
];

export const RESERVED_MUTATION_FIELDS: ReservedMutationKeys[] = [
  "ref",
  "fetchTime",
  "source",
];