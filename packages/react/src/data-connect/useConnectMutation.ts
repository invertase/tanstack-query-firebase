import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import {
  executeMutation,
  type MutationRef,
  type DataConnect,
} from "firebase/data-connect";

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
>(ref: Fn): UseMutationResult<Data, Error, Variables> {
  return useMutation<Data, Error, Variables>({
    mutationFn: async (variables: Variables) => {
      const { data } = await executeMutation<Data, Variables>(ref(variables));
      return data;
    },
  });
}
