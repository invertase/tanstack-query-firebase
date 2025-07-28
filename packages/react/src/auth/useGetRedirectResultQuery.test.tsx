import { renderHook, waitFor } from "@testing-library/react";
import {
  getRedirectResult,
  type PopupRedirectResolver,
  type UserCredential,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useGetRedirectResultQuery } from "./useGetRedirectResultQuery";

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual("firebase/auth");
  return {
    ...actual,
    getRedirectResult: vi.fn(),
  };
});

describe("useGetRedirectResultQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  test("returns user credential on successful redirect", async () => {
    const mockUserCredential = {
      user: {
        uid: "test-uid",
        email: "test@example.com",
      },
      operationType: "signIn",
      providerId: "google.com",
    } as unknown as UserCredential;

    vi.mocked(getRedirectResult).mockResolvedValueOnce(mockUserCredential);

    const { result } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult"],
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUserCredential);
    expect(getRedirectResult).toHaveBeenCalledWith(auth, undefined);
  });

  test("uses custom resolver when provided", async () => {
    const mockResolver = {} as PopupRedirectResolver;
    const mockUserCredential = {
      user: {
        uid: "test-uid",
        email: "test@example.com",
      },
    } as unknown as UserCredential;

    vi.mocked(getRedirectResult).mockResolvedValueOnce(mockUserCredential);

    const { result } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult"],
          auth: { resolver: mockResolver },
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getRedirectResult).toHaveBeenCalledWith(auth, mockResolver);
  });

  test("uses different query keys for different configs", async () => {
    const mockUserCredential1 = {
      user: { uid: "user1" },
    } as unknown as UserCredential;

    const mockUserCredential2 = {
      user: { uid: "user2" },
    } as unknown as UserCredential;

    vi.mocked(getRedirectResult)
      .mockResolvedValueOnce(mockUserCredential1)
      .mockResolvedValueOnce(mockUserCredential2);

    // Render first hook with default key
    const { result: result1 } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult", "config1"],
        }),
      { wrapper },
    );

    // Render second hook with different key
    const { result: result2 } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult", "config2"],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
      expect(result2.current.isSuccess).toBe(true);
    });

    expect(result1.current.data).toEqual(mockUserCredential1);
    expect(result2.current.data).toEqual(mockUserCredential2);
    expect(getRedirectResult).toHaveBeenCalledTimes(2);
  });

  test("adheres to enabled option", async () => {
    const mockUserCredential = {
      user: { uid: "test-uid" },
    } as unknown as UserCredential;

    vi.mocked(getRedirectResult).mockResolvedValueOnce(mockUserCredential);

    const { result } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult"],
          enabled: false,
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(getRedirectResult).not.toHaveBeenCalled();
  });

  test("shares data between hooks with same query key", async () => {
    const mockUserCredential = {
      user: { uid: "test-uid" },
    } as unknown as UserCredential;

    vi.mocked(getRedirectResult).mockResolvedValueOnce(mockUserCredential);

    // Render first instance
    const { result: result1 } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult"],
        }),
      { wrapper },
    );

    // Render second instance with same key
    const { result: result2 } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult"],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
      expect(result2.current.isSuccess).toBe(true);
    });

    expect(result1.current.data).toEqual(result2.current.data);
    expect(getRedirectResult).toHaveBeenCalledTimes(1);
  });

  test("stale time prevents refetch", async () => {
    const mockUserCredential = {
      user: { uid: "test-uid" },
    } as unknown as UserCredential;

    vi.mocked(getRedirectResult).mockResolvedValue(mockUserCredential);

    const { result, rerender } = renderHook(
      () =>
        useGetRedirectResultQuery(auth, {
          queryKey: ["redirectResult"],
          staleTime: 1000,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Rerender while data is still fresh
    rerender();

    expect(getRedirectResult).toHaveBeenCalledTimes(1);
  });
});
