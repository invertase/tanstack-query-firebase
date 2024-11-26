import React, { type ReactNode } from "react";
import { describe, expect, test } from "vitest";
import { useConnectQuery } from "./useConnectQuery";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { listMoviesRef } from "@/dataconnect/default-connector";
import { firebaseApp } from "~/testing-utils";

// initialize firebase app
firebaseApp;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useConnectQuery", () => {
  test("fetches data successfully", async () => {
    const { result } = renderHook(() => useConnectQuery(listMoviesRef()), {
      wrapper,
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveProperty("movies");
    expect(Array.isArray(result.current.data?.movies)).toBe(true);
    expect(result.current.data?.movies.length).toBeGreaterThanOrEqual(0);
  });
});
