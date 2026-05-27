import { act, renderHook, waitFor } from "@testing-library/react";
import { get, ref } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useSetWithPriorityMutation } from "./useSetWithPriorityMutation";

describe("useSetWithPriorityMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("writes a value with priority", async () => {
    const dbRef = ref(database, "tests/useSetWithPriorityMutation");

    const { result } = renderHook(() => useSetWithPriorityMutation(dbRef), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ value: { name: "item" }, priority: 5 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const snapshot = await get(dbRef);
    expect(snapshot.val()).toEqual({ name: "item" });
    expect(snapshot.priority).toBe(5);
  });
});
