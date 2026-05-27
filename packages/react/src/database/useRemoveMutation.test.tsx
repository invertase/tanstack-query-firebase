import { act, renderHook, waitFor } from "@testing-library/react";
import { get, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useRemoveMutation } from "./useRemoveMutation";

describe("useRemoveMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("removes data at a reference", async () => {
    const dbRef = ref(database, "tests/useRemoveMutation");
    await set(dbRef, { hello: "world" });

    const { result } = renderHook(() => useRemoveMutation(dbRef), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const snapshot = await get(dbRef);
    expect(snapshot.exists()).toBe(false);
  });
});
