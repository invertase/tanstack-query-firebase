import { QueryClient } from "@tanstack/react-query";
import { describe, expect, test, vi } from "vitest";
import { createDatabaseSubscriptionQueryFn } from "./createSubscriptionQueryFn";

describe("createDatabaseSubscriptionQueryFn", () => {
  test("resolves on first value and updates cache on subsequent values", async () => {
    const client = new QueryClient();
    const queryKey = ["database", "subscription-test"];
    let onNext: ((value: number) => void) | undefined;
    let onError: ((error: Error) => void) | undefined;

    const subscribe = vi.fn((handlers) => {
      onNext = handlers.onNext;
      onError = handlers.onError;
      return vi.fn();
    });

    const queryFn = createDatabaseSubscriptionQueryFn(subscribe);
    const controller = new AbortController();

    const promise = queryFn({
      client,
      queryKey,
      signal: controller.signal,
      meta: undefined,
    });

    onNext?.(1);
    await expect(promise).resolves.toBe(1);

    onNext?.(2);
    expect(client.getQueryData(queryKey)).toBe(2);

    onError?.(new Error("listener failed"));
    expect(onError).toBeDefined();
  });

  test("rejects on first listener error and invalidates on later errors", async () => {
    const client = new QueryClient();
    const queryKey = ["database", "subscription-error"];
    let onNext: ((value: number) => void) | undefined;
    let onError: ((error: Error) => void) | undefined;

    const subscribe = vi.fn((handlers) => {
      onNext = handlers.onNext;
      onError = handlers.onError;
      return vi.fn();
    });

    const queryFn = createDatabaseSubscriptionQueryFn(subscribe);
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const promise = queryFn({
      client,
      queryKey,
      signal: new AbortController().signal,
      meta: undefined,
    });

    onError?.(new Error("first failure"));

    await expect(promise).rejects.toThrow("first failure");

    onNext?.(1);
    onError?.(new Error("second failure"));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey });
  });

  test("unsubscribes when the fetch is aborted", async () => {
    const client = new QueryClient();
    const unsubscribe = vi.fn();
    const subscribe = vi.fn(() => unsubscribe);

    const queryFn = createDatabaseSubscriptionQueryFn<number>(subscribe);
    const controller = new AbortController();

    queryFn({
      client,
      queryKey: ["database", "abort-test"],
      signal: controller.signal,
      meta: undefined,
    });

    controller.abort();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
