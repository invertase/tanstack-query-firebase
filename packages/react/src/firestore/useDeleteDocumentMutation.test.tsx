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
import { useDeleteDocumentMutation } from "./useDeleteDocumentMutation";

describe("useDeleteDocumentMutation", () => {
  beforeEach(async () => {
    await wipeFirestore();
    queryClient.clear();
  });

  test("successfully deletes an existing document", async () => {
    const docRef = doc(firestore, "tests", "deleteTest");

    await setDoc(docRef, { foo: "bar" });

    const initialSnapshot = await getDoc(docRef);
    expect(initialSnapshot.exists()).toBe(true);

    const { result } = renderHook(() => useDeleteDocumentMutation(docRef), {
      wrapper,
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isIdle).toBe(true);

    await act(() => result.current.mutate());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const finalSnapshot = await getDoc(docRef);
    expect(finalSnapshot.exists()).toBe(false);
  });

  test("handles type-safe document references", async () => {
    interface TestDoc {
      foo: string;
      num: number;
    }

    const docRef = doc(
      firestore,
      "tests",
      "typedDoc",
    ) as DocumentReference<TestDoc>;
    await setDoc(docRef, { foo: "test", num: 123 });

    const { result } = renderHook(() => useDeleteDocumentMutation(docRef), {
      wrapper,
    });

    await act(() => result.current.mutate());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(docRef);
    expect(snapshot.exists()).toBe(false);
  });

  test("handles errors when deleting from restricted collection", async () => {
    const restrictedDocRef = doc(firestore, "restrictedCollection", "someDoc");

    const { result } = renderHook(
      () => useDeleteDocumentMutation(restrictedDocRef),
      { wrapper },
    );

    await act(() => result.current.mutate());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expectFirestoreError(result.current.error, "permission-denied");
  });

  test("calls onSuccess callback after deletion", async () => {
    const docRef = doc(firestore, "tests", "callbackTest");
    await setDoc(docRef, { foo: "callback" });

    let callbackCalled = false;

    const { result } = renderHook(
      () =>
        useDeleteDocumentMutation(docRef, {
          onSuccess: () => {
            callbackCalled = true;
          },
        }),
      { wrapper },
    );

    await act(() => result.current.mutate());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(callbackCalled).toBe(true);
    const snapshot = await getDoc(docRef);
    expect(snapshot.exists()).toBe(false);
  });

  test("handles deletion of non-existent document", async () => {
    const nonExistentDocRef = doc(firestore, "tests", "doesNotExist");

    const { result } = renderHook(
      () => useDeleteDocumentMutation(nonExistentDocRef),
      { wrapper },
    );

    await act(() => result.current.mutate());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const snapshot = await getDoc(nonExistentDocRef);
    expect(snapshot.exists()).toBe(false);
  });
});
