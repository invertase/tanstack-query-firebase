import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi, beforeEach } from "vitest";
import {
  type MultiFactorError,
  MultiFactorResolver,
  getMultiFactorResolver,
} from "firebase/auth";
import { auth, wipeAuth } from "~/testing-utils";
import { useMultiFactorResolverResolveSignInMutation } from "./useMultiFactorResolverResolveSignInMutation";
import { queryClient, wrapper } from "../../utils";

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual("firebase/auth");
  return {
    ...actual,
    getMultiFactorResolver: vi.fn(),
  };
});

const createMockMultiFactorError = (
  operationType: "signIn" | "link" | "reauthenticate" = "signIn",
  customData: Partial<{
    email: string;
    phoneNumber: string;
    tenantId: string;
  }> = {}
) => {
  const mockError = Object.assign(
    new Error("Multi-factor authentication required"),
    {
      name: "MultiFactorError",
      code: "auth/multi-factor-auth-required",
      customData: {
        appName: "[DEFAULT]",
        operationType,
        ...customData,
      },
    }
  );

  return mockError as unknown as MultiFactorError;
};

describe("useMultiFactorResolverResolveSignInMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  test("returns multi-factor resolver for sign-in operation", async () => {
    const mockResolver = {
      hints: [],
      session: "mock-session",
      resolveSignIn: vi.fn(),
    } as unknown as MultiFactorResolver;

    const mockMultiFactorError = createMockMultiFactorError("signIn", {
      email: "test@example.com",
    });

    vi.mocked(getMultiFactorResolver).mockResolvedValueOnce(mockResolver);

    const { result } = renderHook(
      () => useMultiFactorResolverResolveSignInMutation(auth),
      { wrapper }
    );

    let resolver;

    await act(async () => {
      resolver = await result.current.mutateAsync(mockMultiFactorError);
    });

    expect(getMultiFactorResolver).toHaveBeenCalledWith(
      auth,
      mockMultiFactorError
    );
    expect(resolver).toEqual(mockResolver);
  });

  test("returns multi-factor resolver for link operation", async () => {
    const mockResolver = {
      hints: [],
      session: "mock-session",
      resolveSignIn: vi.fn(),
    } as unknown as MultiFactorResolver;

    const mockMultiFactorError = createMockMultiFactorError("link", {
      email: "test@example.com",
    });

    vi.mocked(getMultiFactorResolver).mockResolvedValueOnce(mockResolver);

    const { result } = renderHook(
      () => useMultiFactorResolverResolveSignInMutation(auth),
      { wrapper }
    );

    let resolver;

    await act(async () => {
      resolver = await result.current.mutateAsync(mockMultiFactorError);
    });

    expect(getMultiFactorResolver).toHaveBeenCalledWith(
      auth,
      mockMultiFactorError
    );
    expect(resolver).toEqual(mockResolver);
  });

  test("returns multi-factor resolver for reauthenticate operation", async () => {
    const mockResolver = {
      hints: [],
      session: "mock-session",
      resolveSignIn: vi.fn(),
    } as unknown as MultiFactorResolver;

    const mockMultiFactorError = createMockMultiFactorError("reauthenticate", {
      email: "test@example.com",
    });

    vi.mocked(getMultiFactorResolver).mockResolvedValueOnce(mockResolver);

    const { result } = renderHook(
      () => useMultiFactorResolverResolveSignInMutation(auth),
      { wrapper }
    );

    let resolver;

    await act(async () => {
      resolver = await result.current.mutateAsync(mockMultiFactorError);
    });

    expect(getMultiFactorResolver).toHaveBeenCalledWith(
      auth,
      mockMultiFactorError
    );
    expect(resolver).toEqual(mockResolver);
  });

  test("handles phone number in custom data", async () => {
    const mockResolver = {
      hints: [],
      session: "mock-session",
      resolveSignIn: vi.fn(),
    } as unknown as MultiFactorResolver;

    const mockMultiFactorError = createMockMultiFactorError("signIn", {
      phoneNumber: "+1234567890",
    });

    vi.mocked(getMultiFactorResolver).mockResolvedValueOnce(mockResolver);

    const { result } = renderHook(
      () => useMultiFactorResolverResolveSignInMutation(auth),
      { wrapper }
    );

    let resolver;

    await act(async () => {
      resolver = await result.current.mutateAsync(mockMultiFactorError);
    });

    expect(getMultiFactorResolver).toHaveBeenCalledWith(
      auth,
      mockMultiFactorError
    );
    expect(resolver).toEqual(mockResolver);
  });

  test("executes onSuccess callback with correct parameters", async () => {
    const mockResolver = {
      hints: [],
      session: "mock-session",
      resolveSignIn: vi.fn(),
    } as unknown as MultiFactorResolver;

    const onSuccess = vi.fn();
    const mockMultiFactorError = createMockMultiFactorError("signIn", {
      email: "test@example.com",
      tenantId: "mock-tenant-id",
    });

    vi.mocked(getMultiFactorResolver).mockResolvedValueOnce(mockResolver);

    const { result } = renderHook(
      () => useMultiFactorResolverResolveSignInMutation(auth, { onSuccess }),
      { wrapper }
    );

    await act(async () => {
      await result.current.mutateAsync(mockMultiFactorError);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        mockResolver,
        mockMultiFactorError,
        undefined
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  test("executes onError callback with network error", async () => {
    const onError = vi.fn();
    const networkError = new Error("Network error");
    networkError.name = "NetworkError";

    vi.mocked(getMultiFactorResolver).mockRejectedValueOnce(networkError);

    const mockMultiFactorError = createMockMultiFactorError("signIn");

    const { result } = renderHook(
      () => useMultiFactorResolverResolveSignInMutation(auth, { onError }),
      { wrapper }
    );

    await act(async () => {
      try {
        await result.current.mutateAsync(mockMultiFactorError);
      } catch (error) {
        expect(error).toEqual(networkError);
      }
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        networkError,
        mockMultiFactorError,
        undefined
      );
      expect(onError).toHaveBeenCalledTimes(1);
      expect(result.current.error).toEqual(networkError);
    });
  });
});
