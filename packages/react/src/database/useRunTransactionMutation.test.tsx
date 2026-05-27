import { act, renderHook, waitFor } from "@testing-library/react";
import { get, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useRunTransactionMutation } from "./useRunTransactionMutation";

describe("useRunTransactionMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("runs a transaction and updates data", async () => {
    const dbRef = ref(database, "tests/useRunTransactionMutation");
    await set(dbRef, { count: 1 });

    const { result } = renderHook(
      () =>
        useRunTransactionMutation(dbRef, (current) => {
          const value = (current as { count?: number } | null)?.count ?? 0;
          return { count: value + 1 };
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const snapshot = await get(dbRef);
    expect(snapshot.val()).toEqual({ count: 2 });
    expect(result.current.data?.committed).toBe(true);
  });
});
