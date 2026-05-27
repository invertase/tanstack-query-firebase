import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { database, wipeDatabase } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useGoOnlineMutation } from "./useGoOnlineMutation";

describe("useGoOnlineMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeDatabase();
  });

  test("calls goOnline without throwing", async () => {
    const { result } = renderHook(() => useGoOnlineMutation(database), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
