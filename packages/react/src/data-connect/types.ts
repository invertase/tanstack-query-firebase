import type { QueryKey } from "@tanstack/react-query";
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

// Helper function to determine if a key is a QueryKey.
export function isQueryKey(key: unknown): key is QueryKey {
  return Array.isArray(key) && key.length > 0;
}
