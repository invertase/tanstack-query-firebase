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
});
