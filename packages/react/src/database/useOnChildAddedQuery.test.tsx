import { renderHook, waitFor } from "@testing-library/react";
import { child, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnChildAddedQuery } from "./useOnChildAddedQuery";

describe("useOnChildAddedQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("receives a child_added snapshot", async () => {
    const listRef = ref(database, "tests/useOnChildAddedQuery");
    await set(child(listRef, "a"), { name: "alpha" });

    const { result } = renderHook(
      () =>
        useOnChildAddedQuery(listRef, {
          queryKey: ["database", "onChildAdded", "tests/useOnChildAddedQuery"],
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.key).toBe("a");
    expect(result.current.data?.val()).toEqual({ name: "alpha" });
  });
});
