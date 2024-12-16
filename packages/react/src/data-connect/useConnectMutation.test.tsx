import { describe, expect, test, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useConnectMutation } from "./useConnectMutation";
import { queryClient, wrapper } from "../../utils";
import {
  createMovieRef,
  deleteMovieRef,
  listMoviesRef,
  upsertMovieRef,
} from "@/dataconnect/default-connector";
import { firebaseApp } from "~/testing-utils";

// initialize firebase app
firebaseApp;

describe("useConnectMutation", () => {
  const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
  const onSuccess = vi.fn();

  beforeEach(() => {
    queryClient.clear();
  });

  test("returns initial state correctly for create mutation", () => {
    const { result } = renderHook(() => useConnectMutation(createMovieRef), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe("idle");
  });

  test("returns initial state correctly for update mutation", () => {
    const { result } = renderHook(() => useConnectMutation(upsertMovieRef), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe("idle");
  });

  test("returns initial state correctly for delete mutation", () => {
    const { result } = renderHook(() => useConnectMutation(deleteMovieRef), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe("idle");
  });

  test("executes create mutation successfully", async () => {
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

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toHaveProperty("movie_insert");
    });
  });

  test("executes update mutation successfully", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    expect(createMutationResult.current.isIdle).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await createMutationResult.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
      expect(createMutationResult.current.data).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.current.data?.movie_insert.id!;

    const { result: upsertMutationResult } = renderHook(
      () => useConnectMutation(upsertMovieRef),
      {
        wrapper,
      }
    );

    await act(async () => {
      await upsertMutationResult.current.mutateAsync({
        id: movieId,
        imageUrl: "https://updated-image-url.com/",
        title: "TanStack Query Firebase - updated",
      });
    });

    await waitFor(() => {
      expect(upsertMutationResult.current.isSuccess).toBe(true);
      expect(upsertMutationResult.current.data).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.current.data?.movie_upsert.id).toBe(movieId);
    });
  });

  test("executes delete mutation successfully", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    expect(createMutationResult.current.isIdle).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await createMutationResult.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
      expect(createMutationResult.current.data).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.current.data?.movie_insert.id!;

    const { result: deleteMutationResult } = renderHook(
      () => useConnectMutation(deleteMovieRef),
      {
        wrapper,
      }
    );

    await act(async () => {
      await deleteMutationResult.current.mutateAsync({
        id: movieId,
      });
    });

    await waitFor(() => {
      expect(deleteMutationResult.current.isSuccess).toBe(true);
      expect(deleteMutationResult.current.data).toHaveProperty("movie_delete");
      expect(deleteMutationResult.current.data?.movie_delete?.id).toBe(movieId);
    });
  });

  test("handles concurrent create mutations", async () => {
    const { result } = renderHook(() => useConnectMutation(createMovieRef), {
      wrapper,
    });

    const movies = [
      {
        title: "Concurrent Test 1",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-1.com/",
      },
      {
        title: "Concurrent Test 2",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-2.com/",
      },
      {
        title: "Concurrent Test 3",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-3.com/",
      },
    ];

    const createdMovies: { id: string }[] = [];

    await act(async () => {
      await Promise.all(
        movies.map(async (movie) => {
          const data = await result.current.mutateAsync(movie);
          createdMovies.push(data?.movie_insert);
        })
      );
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);

      // Assert that all movies were created
      expect(createdMovies).toHaveLength(3);
      createdMovies.forEach((movie) => {
        expect(movie).toHaveProperty("id");
      });

      // Check if all IDs are unique
      const ids = createdMovies.map((movie) => movie.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  test("handles concurrent upsert mutations", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    const movies = [
      {
        title: "Concurrent Test 1",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-1.com/",
      },
      {
        title: "Concurrent Test 2",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-2.com/",
      },
      {
        title: "Concurrent Test 3",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-3.com/",
      },
    ];

    const createdMovies: { id: string }[] = [];

    await act(async () => {
      await Promise.all(
        movies.map(async (movie) => {
          const data = await createMutationResult.current.mutateAsync(movie);
          createdMovies.push(data?.movie_insert);
        })
      );
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
    });

    const { result: upsertMutationResult } = renderHook(
      () => useConnectMutation(upsertMovieRef),
      {
        wrapper,
      }
    );

    const upsertData = createdMovies.map((movie, index) => ({
      id: movie.id,
      title: `Updated Test ${index + 1}`,
      imageUrl: `https://updated-image-url-${index + 1}.com/`,
    }));

    //  concurrent upsert operations
    const upsertedMovies: { id: string }[] = [];
    await act(async () => {
      await Promise.all(
        upsertData.map(async (update) => {
          const data = await upsertMutationResult.current.mutateAsync(update);
          upsertedMovies.push(data?.movie_upsert);
        })
      );
    });

    await waitFor(() => {
      expect(upsertMutationResult.current.isSuccess).toBe(true);
      expect(upsertedMovies).toHaveLength(3);

      // Check if all upserted IDs match original IDs
      const upsertedIds = upsertedMovies.map((movie) => movie.id);
      expect(upsertedIds).toEqual(
        expect.arrayContaining(createdMovies.map((m) => m.id))
      );
    });
  });

  test("handles concurrent delete mutations", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    const movies = [
      {
        title: "Concurrent Test 1",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-1.com/",
      },
      {
        title: "Concurrent Test 2",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-2.com/",
      },
      {
        title: "Concurrent Test 3",
        genre: "concurrent_test",
        imageUrl: "https://test-image-url-3.com/",
      },
    ];

    const createdMovies: { id: string }[] = [];

    await act(async () => {
      await Promise.all(
        movies.map(async (movie) => {
          const data = await createMutationResult.current.mutateAsync(movie);
          createdMovies.push(data?.movie_insert);
        })
      );
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
    });

    const { result: deleteMutationResult } = renderHook(
      () => useConnectMutation(deleteMovieRef),
      {
        wrapper,
      }
    );

    const deleteData = createdMovies.map((movie, index) => ({
      id: movie.id,
    }));

    //  concurrent delete operations
    const deletedMovies: { id: string }[] = [];
    await act(async () => {
      await Promise.all(
        deleteData.map(async (i) => {
          const data = await deleteMutationResult.current.mutateAsync(i);
          deletedMovies.push(data.movie_delete!);
        })
      );
    });

    await waitFor(() => {
      expect(deleteMutationResult.current.isSuccess).toBe(true);
      expect(deletedMovies).toHaveLength(3);

      // Check if all deleted IDs match original IDs
      const deletedIds = deletedMovies.map((movie) => movie.id);
      expect(deletedIds).toEqual(
        expect.arrayContaining(createdMovies.map((m) => m.id))
      );
    });
  });

  test("invalidates queries specified in the invalidate option for create mutations", async () => {
    const { result } = renderHook(
      () =>
        useConnectMutation(createMovieRef, { invalidate: [listMoviesRef()] }),
      {
        wrapper,
      }
    );

    const movie = {
      title: "TanStack Query Firebase",
      genre: "invalidate_option_test",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await result.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: [listMoviesRef().name, undefined],
    });
  });

  test("invalidates queries specified in the invalidate option for upsert mutations", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    expect(createMutationResult.current.isIdle).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await createMutationResult.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
      expect(createMutationResult.current.data).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.current.data?.movie_insert.id!;

    const { result: upsertMutationResult } = renderHook(
      () =>
        useConnectMutation(upsertMovieRef, { invalidate: [listMoviesRef()] }),
      {
        wrapper,
      }
    );

    await act(async () => {
      await upsertMutationResult.current.mutateAsync({
        id: movieId,
        imageUrl: "https://updated-image-url.com/",
        title: "TanStack Query Firebase - updated",
      });
    });

    await waitFor(() => {
      expect(upsertMutationResult.current.isSuccess).toBe(true);
      expect(upsertMutationResult.current.data).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.current.data?.movie_upsert.id).toBe(movieId);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: [listMoviesRef().name, undefined],
    });
  });

  test("invalidates queries specified in the invalidate option for delete mutations", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    expect(createMutationResult.current.isIdle).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await createMutationResult.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
      expect(createMutationResult.current.data).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.current.data?.movie_insert.id!;

    const { result: deleteMutationResult } = renderHook(
      () =>
        useConnectMutation(deleteMovieRef, { invalidate: [listMoviesRef()] }),
      {
        wrapper,
      }
    );

    await act(async () => {
      await deleteMutationResult.current.mutateAsync({
        id: movieId,
      });
    });

    await waitFor(() => {
      expect(deleteMutationResult.current.isSuccess).toBe(true);
      expect(deleteMutationResult.current.data).toHaveProperty("movie_delete");
      expect(deleteMutationResult.current.data?.movie_delete?.id).toBe(movieId);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: [listMoviesRef().name, undefined],
    });
  });

  test("calls onSuccess callback after successful create mutation", async () => {
    const { result } = renderHook(
      () => useConnectMutation(createMovieRef, { onSuccess }),
      { wrapper }
    );

    const movie = {
      title: "TanStack Query Firebase",
      genre: "onsuccess_callback_test",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await result.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toHaveProperty("movie_insert");
    });
  });

  test("calls onSuccess callback after successful upsert mutation", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    expect(createMutationResult.current.isIdle).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await createMutationResult.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
      expect(createMutationResult.current.data).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.current.data?.movie_insert.id!;

    const { result: upsertMutationResult } = renderHook(
      () => useConnectMutation(upsertMovieRef, { onSuccess }),
      {
        wrapper,
      }
    );

    await act(async () => {
      await upsertMutationResult.current.mutateAsync({
        id: movieId,
        imageUrl: "https://updated-image-url.com/",
        title: "TanStack Query Firebase - updated",
      });
    });

    await waitFor(() => {
      expect(upsertMutationResult.current.isSuccess).toBe(true);
      expect(onSuccess).toHaveBeenCalled();
      expect(upsertMutationResult.current.data).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.current.data?.movie_upsert.id).toBe(movieId);
    });
  });

  test("executes delete mutation successfully", async () => {
    const { result: createMutationResult } = renderHook(
      () => useConnectMutation(createMovieRef),
      {
        wrapper,
      }
    );

    expect(createMutationResult.current.isIdle).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await act(async () => {
      await createMutationResult.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
      expect(createMutationResult.current.data).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.current.data?.movie_insert.id!;

    const { result: deleteMutationResult } = renderHook(
      () => useConnectMutation(deleteMovieRef, { onSuccess }),
      {
        wrapper,
      }
    );

    await act(async () => {
      await deleteMutationResult.current.mutateAsync({
        id: movieId,
      });
    });

    await waitFor(() => {
      expect(deleteMutationResult.current.isSuccess).toBe(true);
      expect(onSuccess).toHaveBeenCalled();
      expect(deleteMutationResult.current.data).toHaveProperty("movie_delete");
      expect(deleteMutationResult.current.data?.movie_delete?.id).toBe(movieId);
    });
  });
});
