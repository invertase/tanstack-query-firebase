import React from "react";
import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useValidatePasswordMutation } from "./useValidatePasswordMutation";
import { auth, wipeAuth } from "~/testing-utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useValidatePasswordMutation", () => {
  const validPassword = "ValidPassword123!";
  const invalidPassword = "short";

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  test("validates a password successfully", async () => {
    const { result } = renderHook(() => useValidatePasswordMutation(auth), {
      wrapper,
    });

    act(() => {
      result.current.mutate(validPassword);
    });
  });
});
