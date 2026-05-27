import { act, renderHook, waitFor } from "@testing-library/react";
import { onDisconnect, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnDisconnectCancelMutation } from "./useOnDisconnectCancelMutation";

describe("useOnDisconnectCancelMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("cancels a pending onDisconnect operation", async () => {
    const dbRef = ref(database, "tests/useOnDisconnectCancelMutation");
    await set(dbRef, { status: "online" });
    await onDisconnect(dbRef).set({ status: "offline" });

    const { result } = renderHook(() => useOnDisconnectCancelMutation(dbRef), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
