import { act, renderHook, waitFor } from "@testing-library/react";
import { ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnDisconnectSetMutation } from "./useOnDisconnectSetMutation";

describe("useOnDisconnectSetMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("registers an onDisconnect set operation", async () => {
    const dbRef = ref(database, "tests/useOnDisconnectSetMutation");
    await set(dbRef, { status: "online" });

    const { result } = renderHook(() => useOnDisconnectSetMutation(dbRef), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ status: "offline" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
