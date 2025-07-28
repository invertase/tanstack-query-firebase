import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import {
  addDoc,
  average,
  collection,
  count,
  query,
  sum,
  where,
} from "firebase/firestore";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import {
  expectFirestoreError,
  firestore,
  wipeFirestore,
} from "~/testing-utils";
import { useGetAggregateFromServerQuery } from "./useGetAggregateFromServerQuery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useGetAggregateFromServerQuery", () => {
  beforeEach(async () => await wipeFirestore());

  test("returns correct count for empty collection", async () => {
    const collectionRef = collection(firestore, "tests");

    const { result } = renderHook(
      () =>
        useGetAggregateFromServerQuery(
          collectionRef,
          { countOfDocs: count() },
          { queryKey: ["aggregate", "empty"] },
        ),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data().countOfDocs).toBe(0);
  });

  test("returns correct aggregate values for non-empty collection", async () => {
    const collectionRef = collection(firestore, "tests");

    await addDoc(collectionRef, { value: 10 });
    await addDoc(collectionRef, { value: 20 });
    await addDoc(collectionRef, { value: 30 });

    const { result } = renderHook(
      () =>
        useGetAggregateFromServerQuery(
          collectionRef,
          {
            countOfDocs: count(),
            averageValue: average("value"),
            totalValue: sum("value"),
          },
          { queryKey: ["aggregate", "non-empty"] },
        ),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data().averageValue).toBe(20);
    expect(result.current.data?.data().totalValue).toBe(60);
    expect(result.current.data?.data().countOfDocs).toBe(3);
  });

  test("handles complex queries", async () => {
    const collectionRef = collection(firestore, "tests");

    await addDoc(collectionRef, { category: "A", books: 10 });
    await addDoc(collectionRef, { category: "B", books: 20 });
    await addDoc(collectionRef, { category: "A", books: 30 });
    await addDoc(collectionRef, { category: "C", books: 40 });

    const complexQuery = query(collectionRef, where("category", "==", "A"));

    const { result } = renderHook(
      () =>
        useGetAggregateFromServerQuery(
          complexQuery,
          {
            countOfDocs: count(),
            averageNumberOfBooks: average("books"),
            totalNumberOfBooks: sum("books"),
          },
          { queryKey: ["aggregate", "complex"] },
        ),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data().averageNumberOfBooks).toBe(20);
    expect(result.current.data?.data().totalNumberOfBooks).toBe(40);
    expect(result.current.data?.data().countOfDocs).toBe(2);
  });

  test("handles restricted collection appropriately", async () => {
    const collectionRef = collection(firestore, "restrictedCollection");

    const { result } = renderHook(
      () =>
        useGetAggregateFromServerQuery(
          collectionRef,
          { count: count() },
          { queryKey: ["aggregate", "restricted"] },
        ),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expectFirestoreError(result.current.error, "permission-denied");
  });

  test("returns pending state initially", async () => {
    const collectionRef = collection(firestore, "tests");

    await addDoc(collectionRef, { value: 10 });

    const { result } = renderHook(
      () =>
        useGetAggregateFromServerQuery(
          collectionRef,
          { count: count() },
          { queryKey: ["aggregate", "pending"] },
        ),
      { wrapper },
    );

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data().count).toBe(1);
  });
});
