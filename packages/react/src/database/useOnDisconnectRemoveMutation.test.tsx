import { act, renderHook, waitFor } from "@testing-library/react";
import { ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnDisconnectRemoveMutation } from "./useOnDisconnectRemoveMutation";

describe("useOnDisconnectRemoveMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("registers an onDisconnect remove operation", async () => {
    const dbRef = ref(database, "tests/useOnDisconnectRemoveMutation");
    await set(dbRef, { status: "online" });

    const { result } = renderHook(() => useOnDisconnectRemoveMutation(dbRef), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
