import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  addMeta,
  createMovie,
  createMovieRef,
  deleteMetaRef,
  deleteMovieRef,
  getMovieByIdRef,
  listMoviesRef,
  upsertMovieRef,
} from "@/dataconnect/default-connector";
import { firebaseApp } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useDataConnectMutation } from "./useDataConnectMutation";

// initialize firebase app
firebaseApp;

describe("useDataConnectMutation", () => {
  const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  test("returns initial state correctly for create mutation", () => {
    const { result } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
    );

    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe("idle");
  });

  test("returns initial state correctly for update mutation", () => {
    const { result } = renderHook(
      () => useDataConnectMutation(upsertMovieRef),
      {
        wrapper,
      },
    );

    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe("idle");
  });

  test("returns initial state correctly for delete mutation", () => {
    const { result } = renderHook(
      () => useDataConnectMutation(deleteMovieRef),
      {
        wrapper,
      },
    );

    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe("idle");
  });

  test("executes create mutation successfully thus returning flattened data including ref, source, and fetchTime", async () => {
    const { result } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
    );

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
      expect(result.current.data).toBeDefined();
      expect(result.current.dataConnectResult).toHaveProperty("ref");
      expect(result.current.dataConnectResult).toHaveProperty("source");
      expect(result.current.dataConnectResult).toHaveProperty("fetchTime");
      expect(result.current.data).toHaveProperty("movie_insert");
      expect(result.current.dataConnectResult?.ref?.variables).toMatchObject(
        movie,
      );
    });
  });

  test("executes update mutation successfully thus returning flattened data including ref, source, and fetchTime", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
      () => useDataConnectMutation(upsertMovieRef),
      {
        wrapper,
      },
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
      expect(upsertMutationResult.current.data).toBeDefined();
      expect(upsertMutationResult.current.dataConnectResult).toHaveProperty(
        "ref",
      );
      expect(upsertMutationResult.current.dataConnectResult).toHaveProperty(
        "source",
      );
      expect(upsertMutationResult.current.dataConnectResult).toHaveProperty(
        "fetchTime",
      );
      expect(upsertMutationResult.current.data).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.current.data?.movie_upsert.id).toBe(movieId);
    });
  });

  test("executes delete mutation successfully thus returning flattened data including ref, source, and fetchTime", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
      () => useDataConnectMutation(deleteMovieRef),
      {
        wrapper,
      },
    );

    await act(async () => {
      await deleteMutationResult.current.mutateAsync({
        id: movieId,
      });
    });

    await waitFor(() => {
      expect(deleteMutationResult.current.isSuccess).toBe(true);
      expect(deleteMutationResult.current.data).toBeDefined();
      expect(deleteMutationResult.current.dataConnectResult).toHaveProperty(
        "ref",
      );
      expect(deleteMutationResult.current.dataConnectResult).toHaveProperty(
        "source",
      );
      expect(deleteMutationResult.current.dataConnectResult).toHaveProperty(
        "fetchTime",
      );
      expect(deleteMutationResult.current.data).toHaveProperty("movie_delete");
      expect(deleteMutationResult.current.data?.movie_delete?.id).toBe(movieId);
    });
  });

  test("handles concurrent create mutations", async () => {
    const { result } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
          const data = await result.current.mutateAsync(movie);
          createdMovies.push(data?.movie_insert);
        }),
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
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        }),
      );
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
    });

    const { result: upsertMutationResult } = renderHook(
      () => useDataConnectMutation(upsertMovieRef),
      {
        wrapper,
      },
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
        }),
      );
    });

    await waitFor(() => {
      expect(upsertMutationResult.current.isSuccess).toBe(true);
      expect(upsertedMovies).toHaveLength(3);

      // Check if all upserted IDs match original IDs
      const upsertedIds = upsertedMovies.map((movie) => movie.id);
      expect(upsertedIds).toEqual(
        expect.arrayContaining(createdMovies.map((m) => m.id)),
      );
    });
  });

  test("handles concurrent delete mutations", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        }),
      );
    });

    await waitFor(() => {
      expect(createMutationResult.current.isSuccess).toBe(true);
    });

    const { result: deleteMutationResult } = renderHook(
      () => useDataConnectMutation(deleteMovieRef),
      {
        wrapper,
      },
    );

    const deleteData = createdMovies.map((movie, _index) => ({
      id: movie.id,
    }));

    //  concurrent delete operations
    const deletedMovies: { id: string }[] = [];
    await act(async () => {
      await Promise.all(
        deleteData.map(async (i) => {
          const data = await deleteMutationResult.current.mutateAsync(i);
          deletedMovies.push(data.movie_delete!);
        }),
      );
    });

    await waitFor(() => {
      expect(deleteMutationResult.current.isSuccess).toBe(true);
      expect(deletedMovies).toHaveLength(3);

      // Check if all deleted IDs match original IDs
      const deletedIds = deletedMovies.map((movie) => movie.id);
      expect(deletedIds).toEqual(
        expect.arrayContaining(createdMovies.map((m) => m.id)),
      );
    });
  });

  test("invalidates queries specified in the invalidate option for create mutations with non-variable refs", async () => {
    const { result } = renderHook(
      () =>
        useDataConnectMutation(createMovieRef, {
          invalidate: [listMoviesRef()],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [listMoviesRef().name],
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for create mutations with variable refs", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };

    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const { result } = renderHook(
      () =>
        useDataConnectMutation(createMovieRef, {
          invalidate: [getMovieByIdRef({ id: movieId })],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["GetMovieById", { id: movieId }],
        exact: true,
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for create mutations with both variable and non-variable refs", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };

    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const { result } = renderHook(
      () =>
        useDataConnectMutation(createMovieRef, {
          invalidate: [listMoviesRef(), getMovieByIdRef({ id: movieId })],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(2);
    expect(invalidateQueriesSpy.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            queryKey: ["GetMovieById", { id: movieId }],
            exact: true,
          }),
        ],
        [
          expect.objectContaining({
            queryKey: ["ListMovies"],
          }),
        ],
      ]),
    );
  });

  test("invalidates queries specified in the invalidate option for upsert mutations with non-variable refs", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        useDataConnectMutation(upsertMovieRef, {
          invalidate: [listMoviesRef()],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [listMoviesRef().name],
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for upsert mutations with variable refs", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        useDataConnectMutation(upsertMovieRef, {
          invalidate: [getMovieByIdRef({ id: movieId })],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["GetMovieById", { id: movieId }],
        exact: true,
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for upsert mutations with both variable and non-variable refs", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        useDataConnectMutation(upsertMovieRef, {
          invalidate: [listMoviesRef(), getMovieByIdRef({ id: movieId })],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(2);
    expect(invalidateQueriesSpy.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            queryKey: ["GetMovieById", { id: movieId }],
            exact: true,
          }),
        ],
        [
          expect.objectContaining({
            queryKey: ["ListMovies"],
          }),
        ],
      ]),
    );
  });

  test("invalidates queries specified in the invalidate option for delete mutations with non-variable refs", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        useDataConnectMutation(deleteMovieRef, {
          invalidate: [listMoviesRef()],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [listMoviesRef().name],
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for delete mutations with variable refs", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        useDataConnectMutation(deleteMovieRef, {
          invalidate: [getMovieByIdRef({ id: movieId })],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["GetMovieById", { id: movieId }],
        exact: true,
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for delete mutations with both variable and non-variable refs", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
        useDataConnectMutation(deleteMovieRef, {
          invalidate: [listMoviesRef(), getMovieByIdRef({ id: movieId })],
        }),
      {
        wrapper,
      },
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

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(2);
    expect(invalidateQueriesSpy.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            queryKey: ["GetMovieById", { id: movieId }],
            exact: true,
          }),
        ],
        [
          expect.objectContaining({
            queryKey: ["ListMovies"],
          }),
        ],
      ]),
    );
  });

  test("calls onSuccess callback after successful create mutation", async () => {
    const { result } = renderHook(
      () => useDataConnectMutation(createMovieRef, { onSuccess }),
      { wrapper },
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
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
      () => useDataConnectMutation(upsertMovieRef, { onSuccess }),
      {
        wrapper,
      },
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

  test("calls onSuccess callback after successful delete mutation", async () => {
    const { result: createMutationResult } = renderHook(
      () => useDataConnectMutation(createMovieRef),
      {
        wrapper,
      },
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
      () => useDataConnectMutation(deleteMovieRef, { onSuccess }),
      {
        wrapper,
      },
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

  test("executes mutation successfully with function ref", async () => {
    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    const { result } = renderHook(
      () => useDataConnectMutation(() => createMovieRef(movie)),
      {
        wrapper,
      },
    );

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toHaveProperty("movie_insert");
      expect(result.current.dataConnectResult?.ref?.variables).toMatchObject({
        title: movie.title,
        genre: movie.genre,
        imageUrl: movie.imageUrl,
      });
    });
  });

  test("executes mutation successfully with function ref that accepts variables", async () => {
    const { result } = renderHook(
      () =>
        useDataConnectMutation((title: string) =>
          createMovieRef({
            title,
            genre: "library",
            imageUrl: "https://test-image-url.com/",
          }),
        ),
      {
        wrapper,
      },
    );

    const movieTitle = "TanStack Query Firebase";

    await act(async () => {
      await result.current.mutateAsync(movieTitle);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toHaveProperty("movie_insert");
      expect(result.current.dataConnectResult?.ref?.variables).toMatchObject({
        title: movieTitle,
        genre: "library",
        imageUrl: "https://test-image-url.com/",
      });
    });
  });
  test("stores valid properties in resultMeta", async () => {
    const metaResult = await addMeta();
    const { result } = renderHook(() => useDataConnectMutation(deleteMetaRef), {
      wrapper,
    });
    await act(async () => {
      await result.current.mutateAsync({ id: metaResult.data.ref.id });
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.ref).to.deep.eq(metaResult.data.ref);
  });
});
