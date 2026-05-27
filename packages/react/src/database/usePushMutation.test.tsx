import { act, renderHook, waitFor } from "@testing-library/react";
import { get, ref } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { usePushMutation } from "./usePushMutation";

describe("usePushMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("pushes a new child with a value", async () => {
    const listRef = ref(database, "tests/usePushMutation");

    const { result } = renderHook(() => usePushMutation(listRef), { wrapper });

    await act(async () => {
      result.current.mutate({ name: "new-item" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const pushedRef = result.current.data;
    expect(pushedRef?.key).toBeTruthy();

    const snapshot = await get(pushedRef!);
    expect(snapshot.val()).toEqual({ name: "new-item" });
  });
});
