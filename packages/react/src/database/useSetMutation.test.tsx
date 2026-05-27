import { act, renderHook, waitFor } from "@testing-library/react";
import { get, ref } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useSetMutation } from "./useSetMutation";

describe("useSetMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("writes a value to the database", async () => {
    const dbRef = ref(database, "tests/useSetMutation");

    const { result } = renderHook(() => useSetMutation(dbRef), { wrapper });

    await act(async () => {
      result.current.mutate({ hello: "world" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const snapshot = await get(dbRef);
    expect(snapshot.val()).toEqual({ hello: "world" });
  });
});
