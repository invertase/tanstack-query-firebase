import { renderHook, waitFor } from "@testing-library/react";
import { child, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnChildChangedQuery } from "./useOnChildChangedQuery";

describe("useOnChildChangedQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("receives child_changed updates", async () => {
    const listRef = ref(database, "tests/useOnChildChangedQuery");
    const childRef = child(listRef, "a");

    const { result } = renderHook(
      () =>
        useOnChildChangedQuery(listRef, {
          queryKey: [
            "database",
            "onChildChanged",
            "tests/useOnChildChangedQuery",
          ],
        }),
      { wrapper },
    );

    await set(childRef, { name: "alpha" });
    await set(childRef, { name: "beta" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.val()).toEqual({ name: "beta" });
  });
});
