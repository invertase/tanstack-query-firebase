import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { type FirebaseError } from "firebase/app";
import {
  executeMutation,
  type MutationRef,
  type DataConnect,
  type QueryRef,
} from "firebase/data-connect";

type UseConnectMutationOptions<
  TData = unknown,
  TError = FirebaseError,
  Variables = unknown
> = Omit<UseMutationOptions<TData, TError, Variables>, "mutationFn"> & {
  invalidate?: QueryRef<unknown, unknown>[];
};

export function useConnectMutation<
  Fn extends (...args: any[]) => MutationRef<any, any>,
  Data = ReturnType<Fn> extends MutationRef<infer D, any> ? D : never,
  Variables = Fn extends (
    dc: DataConnect,
    vars: infer V
  ) => MutationRef<any, any>
    ? V
    : Fn extends (vars: infer V) => MutationRef<any, any>
    ? V
    : never
>(
  ref: Fn,
  options?: UseConnectMutationOptions<Data, FirebaseError, Variables>
): UseMutationResult<Data, FirebaseError, Variables> {
  const queryClient = useQueryClient();

  return useMutation<Data, FirebaseError, Variables>({
    ...options,
    onSuccess(...args) {
      if (options?.invalidate && options.invalidate.length) {
        for (const ref of options.invalidate) {
          queryClient.invalidateQueries({
            queryKey: [ref.name, ref.variables],
          });
        }
      }

      options?.onSuccess?.(...args);
    },
    mutationFn: async (variables: Variables) => {
      const { data } = await executeMutation<Data, Variables>(ref(variables));
      return data;
    },
  });
}
