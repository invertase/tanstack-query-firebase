import { renderHook, waitFor } from "@testing-library/react";
import { ref, set } from "firebase/database";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useOnValueQuery } from "./useOnValueQuery";

describe("useOnValueQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("subscribes and returns the initial snapshot", async () => {
    const dbRef = ref(database, "tests/useOnValueQuery");
    await set(dbRef, { count: 1 });

    const { result } = renderHook(
      () =>
        useOnValueQuery(dbRef, {
          queryKey: ["database", "onValue", "tests/useOnValueQuery"],
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.val()).toEqual({ count: 1 });
  });

  test("updates when the underlying value changes", async () => {
    const dbRef = ref(database, "tests/useOnValueQuery-live");
    await set(dbRef, { count: 1 });

    const { result } = renderHook(
      () =>
        useOnValueQuery(dbRef, {
          queryKey: ["database", "onValue", "tests/useOnValueQuery-live"],
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.data?.val()?.count).toBe(1));

    await set(dbRef, { count: 2 });

    await waitFor(() => expect(result.current.data?.val()?.count).toBe(2));
  });

  test("respects enabled: false", async () => {
    const dbRef = ref(database, "tests/useOnValueQuery-disabled");
    await set(dbRef, { count: 1 });

    const { result } = renderHook(
      () =>
        useOnValueQuery(dbRef, {
          queryKey: ["database", "onValue", "tests/useOnValueQuery-disabled"],
          enabled: false,
        }),
      { wrapper },
    );

    expect(result.current.status).toBe("pending");
    expect(result.current.data).toBeUndefined();
  });
});
