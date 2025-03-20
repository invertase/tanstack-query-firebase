import { renderHook, waitFor } from "@testing-library/react";
import type * as FirestoreTypes from "firebase/firestore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { firestore, wipeFirestore } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useNamedQuery } from "./useNamedQuery";

// Mock the entire firebase/firestore module
vi.mock("firebase/firestore", async () => {
  const actual =
    await vi.importActual<typeof FirestoreTypes>("firebase/firestore");
  return {
    collection: actual?.collection,
    query: actual?.query,
    where: actual?.where,
    getFirestore: actual?.getFirestore,
    connectFirestoreEmulator: actual?.connectFirestoreEmulator,
    namedQuery: vi.fn(),
  };
});

// Import after mock definition
import { collection, namedQuery, query, where } from "firebase/firestore";

describe("useNamedQuery", () => {
  beforeEach(async () => {
    await wipeFirestore();
    queryClient.clear();
    vi.clearAllMocks();
  });

  test("returns correct data for an existing named query", async () => {
    const mockQuery = query(
      collection(firestore, "test"),
      where("field", "==", "value"),
    );
    vi.mocked(namedQuery).mockResolvedValue(mockQuery);

    const { result } = renderHook(
      () =>
        useNamedQuery(firestore, "existingQuery", {
          queryKey: ["named", "existing"],
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe(mockQuery);
    expect(namedQuery).toHaveBeenCalledWith(firestore, "existingQuery");
    expect(result.current.error).toBeNull();
  });

  test("returns null for non-existent named query", async () => {
    vi.mocked(namedQuery).mockResolvedValue(null);

    const { result } = renderHook(
      () =>
        useNamedQuery(firestore, "nonExistentQuery", {
          queryKey: ["named", "nonexistent"],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(namedQuery).toHaveBeenCalledWith(firestore, "nonExistentQuery");
    expect(result.current.error).toBeNull();
  });

  test("handles error case properly", async () => {
    const mockError = new Error("Query not found");
    vi.mocked(namedQuery).mockRejectedValue(mockError);

    const { result } = renderHook(
      () =>
        useNamedQuery(firestore, "errorQuery", {
          queryKey: ["named", "error"],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(mockError);
    expect(namedQuery).toHaveBeenCalledWith(firestore, "errorQuery");
  });

  test("handles query options correctly", async () => {
    const mockQuery = query(collection(firestore, "test"));
    vi.mocked(namedQuery).mockResolvedValue(mockQuery);

    const { result } = renderHook(
      () =>
        useNamedQuery(firestore, "optionsQuery", {
          queryKey: ["named", "options"],
          enabled: false,
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(namedQuery).not.toHaveBeenCalled();
  });

  test("handles refetching correctly", async () => {
    const mockQuery = query(collection(firestore, "test"));
    vi.mocked(namedQuery).mockResolvedValue(mockQuery);

    const { result } = renderHook(
      () =>
        useNamedQuery(firestore, "refetchQuery", {
          queryKey: ["named", "refetch"],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.refetch();

    expect(namedQuery).toHaveBeenCalledTimes(2);
    expect(result.current.data).toBe(mockQuery);
  });
});
