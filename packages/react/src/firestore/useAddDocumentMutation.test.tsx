import { renderHook, waitFor } from "@testing-library/react";
import {
  type CollectionReference,
  collection,
  type DocumentReference,
  getDoc,
} from "firebase/firestore";
import { act } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import {
  expectFirestoreError,
  firestore,
  wipeFirestore,
} from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useAddDocumentMutation } from "./useAddDocumentMutation";

describe("useAddDocumentMutation", () => {
  beforeEach(async () => {
    await wipeFirestore();
    queryClient.clear();
  });

  test("successfully adds a document", async () => {
    const collectionRef = collection(firestore, "tests");
    const testData = { foo: "bar", num: 42 };

    const { result } = renderHook(() => useAddDocumentMutation(collectionRef), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    const docRef = result.current.data!;

    const snapshot = await getDoc(docRef);
    expect(snapshot.exists()).toBe(true);
    expect(snapshot.data()).toEqual(testData);
  });

  test("handles type-safe data", async () => {
    interface TestDoc {
      foo: string;
      num: number;
    }

    const collectionRef = collection(
      firestore,
      "tests",
    ) as CollectionReference<TestDoc>;
    const testData: TestDoc = { foo: "test", num: 123 };

    const { result } = renderHook(() => useAddDocumentMutation(collectionRef), {
      wrapper,
    });

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(result.current.data!);
    const data = snapshot.data();
    expect(data?.foo).toBe("test");
    expect(data?.num).toBe(123);
  });

  test("handles errors when adding to restricted collection", async () => {
    const restrictedCollectionRef = collection(
      firestore,
      "restrictedCollection",
    );
    const testData = { foo: "bar" };

    const { result } = renderHook(
      () => useAddDocumentMutation(restrictedCollectionRef),
      { wrapper },
    );

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expectFirestoreError(result.current.error, "permission-denied");
  });

  test("calls onSuccess callback with document reference", async () => {
    const collectionRef = collection(firestore, "tests");
    const testData = { foo: "success" };
    let callbackDocRef: DocumentReference | null = null;

    const { result } = renderHook(
      () =>
        useAddDocumentMutation(collectionRef, {
          onSuccess: (docRef) => {
            callbackDocRef = docRef;
          },
        }),
      { wrapper },
    );

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(callbackDocRef).toBeDefined();
    const snapshot = await getDoc(callbackDocRef!);
    expect(snapshot.data()?.foo).toBe("success");
  });

  test("handles empty data object", async () => {
    const collectionRef = collection(firestore, "tests");
    const emptyData = {};

    const { result } = renderHook(() => useAddDocumentMutation(collectionRef), {
      wrapper,
    });

    await act(() => result.current.mutate(emptyData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(result.current.data!);
    expect(snapshot.exists()).toBe(true);
    expect(snapshot.data()).toEqual({});
  });
});
