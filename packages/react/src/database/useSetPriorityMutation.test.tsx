import { act, renderHook, waitFor } from "@testing-library/react";
import { get, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useSetPriorityMutation } from "./useSetPriorityMutation";

describe("useSetPriorityMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("sets priority on a reference", async () => {
    const dbRef = ref(database, "tests/useSetPriorityMutation");
    await set(dbRef, { name: "item" });

    const { result } = renderHook(() => useSetPriorityMutation(dbRef), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(10);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const snapshot = await get(dbRef);
    expect(snapshot.priority).toBe(10);
  });
});
