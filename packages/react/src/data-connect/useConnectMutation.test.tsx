import { describe, expect, test, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConnectMutation } from "./useConnectMutation";
import { queryClient, wrapper } from "../../utils";
import { createMovieRef } from "@/dataconnect/default-connector";
import { firebaseApp } from "~/testing-utils";

// initialize firebase app
firebaseApp;

describe("useConnectMutation", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  test("returns initial state correctly", () => {
    const { result } = renderHook(() => useConnectMutation(createMovieRef), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe("idle");
  });

  test("executes mutation successfully", async () => {
    const { result } = renderHook(() => useConnectMutation(createMovieRef), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await result.current.mutateAsync(movie);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toHaveProperty("movie_insert");
  });
});
