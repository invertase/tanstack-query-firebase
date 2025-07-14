import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { doc, enableNetwork, getDocFromServer } from "firebase/firestore";
import type React from "react";
import { beforeEach, describe, expect, test } from "vitest";
import {
  expectFirestoreError,
  firestore,
  wipeFirestore,
} from "~/testing-utils";
import { useDisableNetworkMutation } from "./useDisableNetworkMutation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useDisableNetworkMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await enableNetwork(firestore);
    await wipeFirestore();
  });

  test("should successfully disable the Firestore network", async () => {
    const { result } = renderHook(() => useDisableNetworkMutation(firestore), {
      wrapper,
    });

    await act(() => result.current.mutate());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify that network operations fail
    const docRef = doc(firestore, "tests", "someDoc");

    try {
      await getDocFromServer(docRef);
      throw new Error(
        "Expected the network to be disabled, but Firestore operation succeeded.",
      );
    } catch (error) {
      expectFirestoreError(error, "unavailable");
    }
  });
});
