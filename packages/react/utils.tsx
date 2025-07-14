import {
  QueryClient,
  QueryClientProvider,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { expect } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export { wrapper, queryClient };

// Helper type to make some properties of a type optional.
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function expectInitialMutationState<TData, TError, TVariables>(result: {
  current: UseMutationResult<TData, TError, TVariables, unknown>;
}) {
  expect(result.current.isSuccess).toBe(false);
  expect(result.current.isPending).toBe(false);
  expect(result.current.isError).toBe(false);
  expect(result.current.isIdle).toBe(true);
  expect(result.current.failureCount).toBe(0);
  expect(result.current.failureReason).toBeNull();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeNull();
}
