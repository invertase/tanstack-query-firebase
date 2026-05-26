import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import type { ListenOptions } from "firebase/database";

/**
 * TanStack Query options for Realtime Database read hooks.
 *
 * @remarks
 * `queryKey` is required (same as Firestore hooks). For listener hooks (`useOnValueQuery`, etc.),
 * pass Firebase {@link https://firebase.google.com/docs/reference/js/database.listoptions | ListenOptions}
 * via `database` (e.g. `{ onlyOnce: true }`).
 */
export type DatabaseUseQueryOptions<
  TData = unknown,
  TError = Error,
> = Omit<UseQueryOptions<TData, TError>, "queryFn"> & {
  database?: ListenOptions;
};

/**
 * TanStack Query options for Realtime Database mutation hooks.
 *
 * @remarks
 * Omits `mutationFn` because the hook wires the Firebase SDK call.
 */
export type DatabaseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
