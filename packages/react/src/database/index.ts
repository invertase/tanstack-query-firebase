// Firebase Realtime Database (`firebase/database`)
// Reference: https://firebase.google.com/docs/reference/js/database
// OnDisconnect methods: https://firebase.google.com/docs/reference/js/database.ondisconnect
//
// Hooks accept `DatabaseReference` / `Query` from `ref()` / `query()` and a `Database`
// instance from `getDatabase()` (obtained at app init, not wrapped).

export { useGetQuery } from "./useGetQuery";
export { useOnValueQuery } from "./useOnValueQuery";
export { useOnChildAddedQuery } from "./useOnChildAddedQuery";
export { useOnChildChangedQuery } from "./useOnChildChangedQuery";
export { useOnChildMovedQuery } from "./useOnChildMovedQuery";
export { useOnChildRemovedQuery } from "./useOnChildRemovedQuery";

export { useSetMutation } from "./useSetMutation";
export { useSetPriorityMutation } from "./useSetPriorityMutation";
export { useSetWithPriorityMutation } from "./useSetWithPriorityMutation";
export { useUpdateMutation } from "./useUpdateMutation";
export { useRemoveMutation } from "./useRemoveMutation";
export { useRunTransactionMutation } from "./useRunTransactionMutation";
export { usePushMutation } from "./usePushMutation";
export { useGoOfflineMutation } from "./useGoOfflineMutation";
export { useGoOnlineMutation } from "./useGoOnlineMutation";

export { useOnDisconnectCancelMutation } from "./useOnDisconnectCancelMutation";
export { useOnDisconnectRemoveMutation } from "./useOnDisconnectRemoveMutation";
export { useOnDisconnectSetMutation } from "./useOnDisconnectSetMutation";
export { useOnDisconnectSetWithPriorityMutation } from "./useOnDisconnectSetWithPriorityMutation";
export { useOnDisconnectUpdateMutation } from "./useOnDisconnectUpdateMutation";

export type { DatabaseMutationOptions, DatabaseUseQueryOptions } from "./types";
