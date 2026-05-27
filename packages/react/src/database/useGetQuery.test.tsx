import { renderHook, waitFor } from "@testing-library/react";
import { get, ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useGetQuery } from "./useGetQuery";

describe("useGetQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("fetches data at a reference", async () => {
    const dbRef = ref(database, "tests/useGetQuery");
    await set(dbRef, { foo: "bar" });

    const { result } = renderHook(
      () =>
        useGetQuery(dbRef, {
          queryKey: ["database", "get", "tests/useGetQuery"],
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.val()).toEqual({ foo: "bar" });
  });

  test("returns an error when the read fails", async () => {
    const dbRef = ref(database, "tests/useGetQuery-missing");

    const { result } = renderHook(
      () =>
        useGetQuery(dbRef, {
          queryKey: ["database", "get", "tests/useGetQuery-missing"],
          retry: false,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const snapshot = await get(dbRef);
    expect(snapshot.exists()).toBe(false);
    expect(result.current.data?.exists()).toBe(false);
  });
});
