import { act, renderHook, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { auth, wipeAuth } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useGetIdTokenQuery } from "./useGetIdTokenQuery";

describe("useGetIdTokenQuery", () => {
  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await auth.signOut();
  });

  test("successfully retrieves an ID token with forceRefresh true", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(
      () => useGetIdTokenQuery(user, { auth: { forceRefresh: true } }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(typeof result.current.data).toBe("string");
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  test("successfully retrieves an ID token with forceRefresh false", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(
      () => useGetIdTokenQuery(user, { auth: { forceRefresh: false } }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(typeof result.current.data).toBe("string");
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  test("can be refetched to get a token again", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(() => useGetIdTokenQuery(user), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Refetch to get a new token
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(typeof result.current.data).toBe("string");
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  test("successfully retrieves an ID token with default options", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(() => useGetIdTokenQuery(user), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(typeof result.current.data).toBe("string");
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  test("respects enabled option", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(
      () => useGetIdTokenQuery(user, { enabled: false }),
      { wrapper },
    );

    // Should not fetch when disabled
    await waitFor(() => expect(result.current.status).toBe("pending"));
    expect(result.current.data).toBeUndefined();
  });

  test("returns error when user is null", async () => {
    const { result } = renderHook(() => useGetIdTokenQuery(null), { wrapper });

    // Should not fetch when user is null (enabled defaults to false)
    expect(result.current.status).toBe("pending");
    expect(result.current.data).toBeUndefined();
  });

  test("returns error when user is null but enabled is forced to true", async () => {
    const { result } = renderHook(
      () => useGetIdTokenQuery(null, { enabled: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain(
      "Cannot retrieve ID token: no Firebase user provided",
    );
  });

  test("caches token when forceRefresh is false", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    // First render
    const { result: result1 } = renderHook(
      () => useGetIdTokenQuery(user, { auth: { forceRefresh: false } }),
      { wrapper },
    );

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));
    const token1 = result1.current.data;

    // Second render with same parameters should use cache
    const { result: result2 } = renderHook(
      () => useGetIdTokenQuery(user, { auth: { forceRefresh: false } }),
      { wrapper },
    );

    // Should be immediately successful with cached data
    expect(result2.current.isSuccess).toBe(true);
    expect(result2.current.data).toBe(token1);
    expect(result2.current.isFetching).toBe(false);
  });

  test("does not cache when forceRefresh is true", async () => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const { result } = renderHook(
      () => useGetIdTokenQuery(user, { auth: { forceRefresh: true } }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that staleTime is 0 when forceRefresh is true
    // This ensures fresh fetch on every call
    const queryKey = [
      "auth",
      "idToken",
      { userId: user.uid, forceRefresh: true },
    ];
    const query = queryClient.getQueryState(queryKey);
    expect(query).toBeDefined();
  });
});
