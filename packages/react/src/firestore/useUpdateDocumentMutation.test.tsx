import { act, renderHook, waitFor } from "@testing-library/react";
import {
  type DocumentReference,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { beforeEach, describe, expect, test } from "vitest";
import {
  expectFirestoreError,
  firestore,
  wipeFirestore,
} from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useUpdateDocumentMutation } from "./useUpdateDocumentMutation";

describe("useUpdateDocumentMutation", () => {
  beforeEach(async () => {
    await wipeFirestore();
    queryClient.clear();
  });

  test("successfully updates an existing document", async () => {
    const docRef = doc(firestore, "tests", "updateTest");

    await setDoc(docRef, { foo: "initial", num: 1, unchanged: "same" });

    const updateData = { foo: "updated", num: 2 };

    const { result } = renderHook(() => useUpdateDocumentMutation(docRef), {
      wrapper,
    });

    expect(result.current.isPending).toBe(false);

    await act(() => result.current.mutate(updateData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    expect(snapshot.exists()).toBe(true);
    expect(snapshot.data()).toEqual({
      foo: "updated",
      num: 2,
      unchanged: "same",
    });
  });

  test("handles nested field updates", async () => {
    const docRef = doc(firestore, "tests", "nestedTest");

    await setDoc(docRef, {
      nested: { field1: "old", field2: "keep" },
      top: "unchanged",
    });

    const updateData = {
      "nested.field1": "new",
    };

    const { result } = renderHook(() => useUpdateDocumentMutation(docRef), {
      wrapper,
    });

    await act(() => result.current.mutate(updateData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    const data = snapshot.data();
    expect(data?.nested.field1).toBe("new");
    expect(data?.nested.field2).toBe("keep");
    expect(data?.top).toBe("unchanged");
  });

  test("handles type-safe document updates", async () => {
    interface TestDoc {
      foo: string;
      num: number;
      optional?: string;
    }

    const docRef = doc(
      firestore,
      "tests",
      "typedDoc",
    ) as DocumentReference<TestDoc>;

    await setDoc(docRef, { foo: "initial", num: 1 });

    const updateData = { num: 42 };

    const { result } = renderHook(() => useUpdateDocumentMutation(docRef), {
      wrapper,
    });

    await act(() => result.current.mutate(updateData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    const data = snapshot.data();
    expect(data?.foo).toBe("initial"); // unchanged
    expect(data?.num).toBe(42); // updated
  });

  test("fails when updating non-existent document", async () => {
    const nonExistentDocRef = doc(firestore, "tests", "doesNotExist");
    const updateData = { foo: "bar" };

    const { result } = renderHook(
      () => useUpdateDocumentMutation(nonExistentDocRef),
      { wrapper },
    );

    await act(() => result.current.mutate(updateData));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expectFirestoreError(result.current.error, "not-found");
  });

  test("handles errors when updating restricted collection", async () => {
    const restrictedDocRef = doc(firestore, "restrictedCollection", "someDoc");
    const updateData = { foo: "bar" };

    const { result } = renderHook(
      () => useUpdateDocumentMutation(restrictedDocRef),
      { wrapper },
    );

    await act(() => result.current.mutate(updateData));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expectFirestoreError(result.current.error, "permission-denied");
  });

  test("calls onSuccess callback after update", async () => {
    const docRef = doc(firestore, "tests", "callbackTest");
    await setDoc(docRef, { foo: "initial" });

    let callbackCalled = false;
    const updateData = { foo: "updated" };

    const { result } = renderHook(
      () =>
        useUpdateDocumentMutation(docRef, {
          onSuccess: () => {
            callbackCalled = true;
          },
        }),
      { wrapper },
    );

    await act(() => result.current.mutate(updateData));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(callbackCalled).toBe(true);
    const snapshot = await getDoc(docRef);
    expect(snapshot.data()?.foo).toBe("updated");
  });

  test("handles empty update object", async () => {
    const docRef = doc(firestore, "tests", "emptyUpdateTest");
    await setDoc(docRef, { foo: "initial" });

    const emptyUpdate = {};

    const { result } = renderHook(() => useUpdateDocumentMutation(docRef), {
      wrapper,
    });

    await act(() => result.current.mutate(emptyUpdate));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    expect(snapshot.data()).toEqual({ foo: "initial" });
  });
});
