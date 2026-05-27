import { act, renderHook, waitFor } from "@testing-library/react";
import { ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnDisconnectUpdateMutation } from "./useOnDisconnectUpdateMutation";

describe("useOnDisconnectUpdateMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("registers an onDisconnect update operation", async () => {
    const dbRef = ref(database, "tests/useOnDisconnectUpdateMutation");
    await set(dbRef, { status: "online", retries: 0 });

    const { result } = renderHook(() => useOnDisconnectUpdateMutation(dbRef), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ status: "offline" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
