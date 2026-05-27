import { act, renderHook, waitFor } from "@testing-library/react";
import { get, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useUpdateMutation } from "./useUpdateMutation";

describe("useUpdateMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("updates child paths on a reference", async () => {
    const dbRef = ref(database, "tests/useUpdateMutation");
    await set(dbRef, { a: 1, b: 2 });

    const { result } = renderHook(() => useUpdateMutation(dbRef), { wrapper });

    await act(async () => {
      result.current.mutate({ b: 3 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const snapshot = await get(dbRef);
    expect(snapshot.val()).toEqual({ a: 1, b: 3 });
  });
});
