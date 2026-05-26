import { renderHook, waitFor } from "@testing-library/react";
import { child, ref, remove, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnChildRemovedQuery } from "./useOnChildRemovedQuery";

describe("useOnChildRemovedQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("receives child_removed snapshots", async () => {
    const listRef = ref(database, "tests/useOnChildRemovedQuery");
    const childRef = child(listRef, "a");

    const { result } = renderHook(
      () =>
        useOnChildRemovedQuery(listRef, {
          queryKey: [
            "database",
            "onChildRemoved",
            "tests/useOnChildRemovedQuery",
          ],
        }),
      { wrapper },
    );

    await set(childRef, { name: "alpha" });
    await remove(childRef);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.key).toBe("a");
  });
});
