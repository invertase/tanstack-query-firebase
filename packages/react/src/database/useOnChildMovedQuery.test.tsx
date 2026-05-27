import { renderHook, waitFor } from "@testing-library/react";
import {
  child,
  orderByPriority,
  query,
  ref,
  set,
  setPriority,
} from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnChildMovedQuery } from "./useOnChildMovedQuery";

describe("useOnChildMovedQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("receives child_moved snapshots", async () => {
    const listRef = ref(database, "tests/useOnChildMovedQuery");
    const listQuery = query(listRef, orderByPriority());
    const childA = child(listRef, "a");
    const childB = child(listRef, "b");

    const { result } = renderHook(
      () =>
        useOnChildMovedQuery(listQuery, {
          queryKey: ["database", "onChildMoved", "tests/useOnChildMovedQuery"],
        }),
      { wrapper },
    );

    await set(childA, { name: "alpha" });
    await setPriority(childA, 1);
    await set(childB, { name: "beta" });
    await setPriority(childB, 2);
    await setPriority(childA, 3);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.key).toBe("a");
  });
});
