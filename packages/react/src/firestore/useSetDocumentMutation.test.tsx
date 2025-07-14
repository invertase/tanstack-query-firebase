import { act, renderHook, waitFor } from "@testing-library/react";
import { type DocumentReference, doc, getDoc } from "firebase/firestore";
import { beforeEach, describe, expect, test } from "vitest";
import {
  expectFirestoreError,
  firestore,
  wipeFirestore,
} from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useSetDocumentMutation } from "./useSetDocumentMutation";

describe("useSetDocumentMutation", () => {
  beforeEach(async () => {
    await wipeFirestore();
    queryClient.clear();
  });

  test("successfully sets a new document", async () => {
    const docRef = doc(firestore, "tests", "setTest");
    const testData = { foo: "bar", num: 42 };

    const { result } = renderHook(() => useSetDocumentMutation(docRef), {
      wrapper,
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isIdle).toBe(true);

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    expect(snapshot.exists()).toBe(true);
    expect(snapshot.data()).toEqual(testData);
  });

  test("successfully overwrites existing document", async () => {
    const docRef = doc(firestore, "tests", "overwriteTest");
    const initialData = { foo: "initial", num: 1 };
    const newData = { foo: "updated", num: 2 };

    const { result } = renderHook(() => useSetDocumentMutation(docRef), {
      wrapper,
    });

    await act(() => result.current.mutate(initialData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    let snapshot = await getDoc(docRef);
    expect(snapshot.data()).toEqual(initialData);

    const { result: result2 } = renderHook(
      () => useSetDocumentMutation(docRef),
      { wrapper },
    );

    await act(() => result2.current.mutate(newData));

    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true);
    });

    snapshot = await getDoc(docRef);
    expect(snapshot.data()).toEqual(newData);
  });

  test("handles type-safe document data", async () => {
    interface TestDoc {
      foo: string;
      num: number;
    }

    const docRef = doc(
      firestore,
      "tests",
      "typedDoc",
    ) as DocumentReference<TestDoc>;
    const testData: TestDoc = { foo: "test", num: 123 };

    const { result } = renderHook(() => useSetDocumentMutation(docRef), {
      wrapper,
    });

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    const data = snapshot.data();
    expect(data?.foo).toBe("test");
    expect(data?.num).toBe(123);
  });

  test("handles errors when setting to restricted collection", async () => {
    const restrictedDocRef = doc(firestore, "restrictedCollection", "someDoc");
    const testData = { foo: "bar" };

    const { result } = renderHook(
      () => useSetDocumentMutation(restrictedDocRef),
      { wrapper },
    );

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expectFirestoreError(result.current.error, "permission-denied");
  });

  test("calls onSuccess callback after setting document", async () => {
    const docRef = doc(firestore, "tests", "callbackTest");
    const testData = { foo: "callback" };
    let callbackCalled = false;

    const { result } = renderHook(
      () =>
        useSetDocumentMutation(docRef, {
          onSuccess: () => {
            callbackCalled = true;
          },
        }),
      { wrapper },
    );

    await act(() => result.current.mutate(testData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(callbackCalled).toBe(true);
    const snapshot = await getDoc(docRef);
    expect(snapshot.data()?.foo).toBe("callback");
  });

  test("handles empty data object", async () => {
    const docRef = doc(firestore, "tests", "emptyDoc");
    const emptyData = {};

    const { result } = renderHook(() => useSetDocumentMutation(docRef), {
      wrapper,
    });

    await act(() => result.current.mutate(emptyData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    expect(snapshot.exists()).toBe(true);
    expect(snapshot.data()).toEqual({});
  });
});
