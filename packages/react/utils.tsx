import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";

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
