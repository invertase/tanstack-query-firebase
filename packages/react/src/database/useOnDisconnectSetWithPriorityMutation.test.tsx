import { act, renderHook, waitFor } from "@testing-library/react";
import { ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnDisconnectSetWithPriorityMutation } from "./useOnDisconnectSetWithPriorityMutation";

describe("useOnDisconnectSetWithPriorityMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("registers an onDisconnect setWithPriority operation", async () => {
    const dbRef = ref(database, "tests/useOnDisconnectSetWithPriorityMutation");
    await set(dbRef, { status: "online" });

    const { result } = renderHook(
      () => useOnDisconnectSetWithPriorityMutation(dbRef),
      { wrapper },
    );

    await act(async () => {
      result.current.mutate({ value: { status: "offline" }, priority: 1 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
