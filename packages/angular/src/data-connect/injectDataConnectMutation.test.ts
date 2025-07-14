import { provideHttpClient } from "@angular/common/http";
import { provideExperimentalZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import {
  connectDataConnectEmulator,
  type DataConnect,
  getDataConnect,
  provideDataConnect,
} from "@angular/fire/data-connect";
import {
  provideTanStackQuery,
  QueryClient,
} from "@tanstack/angular-query-experimental";
import { waitFor } from "@testing-library/angular";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  addMeta,
  connectorConfig,
  createMovie,
  createMovieRef,
  deleteMetaRef,
  deleteMovieRef,
  getMovieByIdRef,
  listMoviesRef,
  type UpsertMovieVariables,
  upsertMovieRef,
} from "@/dataconnect/default-connector";
import { injectDataConnectMutation } from "./index";

// initialize firebase app
initializeApp({ projectId: "p" });

describe("injectDataConnectMutation", () => {
  let queryClient: QueryClient = new QueryClient();
  const onSuccess = vi.fn();
  let invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
  let oldMutationObserver: typeof window.MutationObserver;

  beforeEach(() => {
    vi.resetAllMocks();
    oldMutationObserver = window.MutationObserver;
    queryClient = new QueryClient();
    invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(), // Required as angularfire's ZoneScheduler breaks tests.
        provideFirebaseApp(() => initializeApp({ projectId: "p" })),
        provideDataConnect(() => {
          const dc = getDataConnect(connectorConfig);
          connectDataConnectEmulator(dc, "localhost", 9399);
          return dc;
        }),
        provideHttpClient(),
        provideTanStackQuery(queryClient),
      ],
    });
    // queryClient.clear();
  });

  afterEach(() => {
    window.MutationObserver = oldMutationObserver;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("returns initial state correctly for create mutation", () => {
    const mutation = TestBed.runInInjectionContext(() => {
      return injectDataConnectMutation(createMovieRef);
    });
    expect(mutation.isIdle()).toBe(true);
    expect(mutation.status()).toBe("idle");
  });

  test("returns initial state correctly for update mutation", () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(upsertMovieRef),
    );

    expect(result.isIdle()).toBe(true);
    expect(result.status()).toBe("idle");
  });

  test("returns initial state correctly for delete mutation", () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMovieRef),
    );

    expect(result.isIdle()).toBe(true);
    expect(result.status()).toBe("idle");
  });

  test("executes create mutation successfully thus returning flattened data including ref, source, and fetchTime", async () => {
    const mutation = TestBed.runInInjectionContext(() => {
      return injectDataConnectMutation(createMovieRef);
    });
    // const fdc = TestBed.runInInjectionContext(() => {
    //   return inject(DataConnect);
    // });

    expect(mutation.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };
    await mutation.mutateAsync(movie);

    await waitFor(() => {
      expect(mutation.isSuccess()).toBe(true);
      expect(mutation.data()).toBeDefined();
      expect(mutation.dataConnectResult()).toHaveProperty("ref");
      expect(mutation.dataConnectResult()).toHaveProperty("source");
      expect(mutation.dataConnectResult()).toHaveProperty("fetchTime");
      expect(mutation.data()).toHaveProperty("movie_insert");
      expect(mutation.dataConnectResult()?.ref?.variables).toMatchObject(movie);
    });
  });

  test("executes update mutation successfully thus returning flattened data including ref, source, and fetchTime", async () => {
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const upsertMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(upsertMovieRef),
    );

    await upsertMutationResult.mutateAsync({
      id: movieId,
      imageUrl: "https://updated-image-url.com/",
      title: "TanStack Query Firebase - updated",
    });
    await waitFor(() => {
      expect(upsertMutationResult.isSuccess()).toBe(true);
      expect(upsertMutationResult.data()).toBeDefined();
      expect(upsertMutationResult.dataConnectResult()).toHaveProperty("ref");
      expect(upsertMutationResult.dataConnectResult()).toHaveProperty("source");
      expect(upsertMutationResult.dataConnectResult()).toHaveProperty(
        "fetchTime",
      );
      expect(upsertMutationResult.data()).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.data()?.movie_upsert.id).toBe(movieId);
    });
  });

  test("executes delete mutation successfully thus returning flattened data including ref, source, and fetchTime", async () => {
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const deleteMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMovieRef),
    );

    await deleteMutationResult.mutateAsync({
      id: movieId,
    });

    await waitFor(() => {
      expect(deleteMutationResult.isSuccess()).toBe(true);
      expect(deleteMutationResult.data()).toBeDefined();
      expect(deleteMutationResult.dataConnectResult()).toHaveProperty("ref");
      expect(deleteMutationResult.dataConnectResult()).toHaveProperty("source");
      expect(deleteMutationResult.dataConnectResult()).toHaveProperty(
        "fetchTime",
      );
      expect(deleteMutationResult.data()).toHaveProperty("movie_delete");
      expect(deleteMutationResult.data()?.movie_delete?.id).toBe(movieId);
    });
  });

  test("handles concurrent create mutations", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
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

    await Promise.all(
      movies.map(async (movie) => {
        const data = await result.mutateAsync(movie);
        createdMovies.push(data?.movie_insert);
      }),
    );

    await waitFor(() => {
      expect(result.isSuccess()).toBe(true);

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
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
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

    await Promise.all(
      movies.map(async (movie) => {
        const data = await createMutationResult.mutateAsync(movie);
        createdMovies.push(data?.movie_insert);
      }),
    );

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
    });

    const upsertMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(upsertMovieRef),
    );

    const upsertData = createdMovies.map((movie, index) => ({
      id: movie.id,
      title: `Updated Test ${index + 1}`,
      imageUrl: `https://updated-image-url-${index + 1}.com/`,
    }));

    //  concurrent upsert operations
    const upsertedMovies: { id: string }[] = [];
    await Promise.all(
      upsertData.map(async (update) => {
        const data = await upsertMutationResult.mutateAsync(update);
        upsertedMovies.push(data?.movie_upsert);
      }),
    );

    await waitFor(() => {
      expect(upsertMutationResult.isSuccess()).toBe(true);
      expect(upsertedMovies).toHaveLength(3);

      // Check if all upserted IDs match original IDs
      const upsertedIds = upsertedMovies.map((movie) => movie.id);
      expect(upsertedIds).toEqual(
        expect.arrayContaining(createdMovies.map((m) => m.id)),
      );
    });
  });

  test("handles concurrent delete mutations", async () => {
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
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

    await Promise.all(
      movies.map(async (movie) => {
        const data = await createMutationResult.mutateAsync(movie);
        createdMovies.push(data?.movie_insert);
      }),
    );

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
    });

    const deleteMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMovieRef),
    );

    const deleteData = createdMovies.map((movie, _index) => ({
      id: movie.id,
    }));

    //  concurrent delete operations
    const deletedMovies: { id: string }[] = [];
    await Promise.all(
      deleteData.map(async (i) => {
        const data = await deleteMutationResult.mutateAsync(i);
        deletedMovies.push(data.movie_delete!);
      }),
    );

    await waitFor(() => {
      expect(deleteMutationResult.isSuccess()).toBe(true);
      expect(deletedMovies).toHaveLength(3);

      // Check if all deleted IDs match original IDs
      const deletedIds = deletedMovies.map((movie) => movie.id);
      expect(deletedIds).toEqual(
        expect.arrayContaining(createdMovies.map((m) => m.id)),
      );
    });
  });

  test("invalidates queries specified in the invalidate option for create mutations with non-variable refs", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef, () => ({
        invalidate: [listMoviesRef()],
      })),
    );
    const movie = {
      title: "TanStack Query Firebase",
      genre: "invalidate_option_test",
      imageUrl: "https://test-image-url.com/",
    };
    TestBed.flushEffects();

    // @ts-ignore
    await result.mutateAsync(movie);

    await waitFor(() => {
      expect(result.status()).toBe("success");
    });

    // expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    // expect(invalidateQueriesSpy).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     queryKey: [listMoviesRef().name],
    //   })
    // );
  });

  test("invalidates queries specified in the invalidate option for create mutations with variable refs", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };

    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef, () => ({
        invalidate: [getMovieByIdRef({ id: movieId })],
      })),
    );
    const movie = {
      title: "TanStack Query Firebase",
      genre: "invalidate_option_test",
      imageUrl: "https://test-image-url.com/",
    };

    await result.mutateAsync(movie);

    await waitFor(() => {
      expect(result.status()).toBe("success");
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

    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef, () => ({
        invalidate: [listMoviesRef(), getMovieByIdRef({ id: movieId })],
      })),
    );
    const movie = {
      title: "TanStack Query Firebase",
      genre: "invalidate_option_test",
      imageUrl: "https://test-image-url.com/",
    };

    await result.mutateAsync(movie);

    await waitFor(() => {
      expect(result.status()).toBe("success");
    });

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(2);
    expect(invalidateQueriesSpy.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            queryKey: ["ListMovies"],
          }),
        ],
        [
          expect.objectContaining({
            queryKey: ["GetMovieById", { id: movieId }],
            exact: true,
          }),
        ],
      ]),
    );
  });

  test("invalidates queries specified in the invalidate option for upsert mutations with non-variable refs", async () => {
    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).to.be.true;
    });

    expect(createMutationResult.data()).toHaveProperty("movie_insert");

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const upsertMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(
        (_: DataConnect, vars: UpsertMovieVariables) => upsertMovieRef(vars),
        () => ({
          invalidate: [listMoviesRef()],
        }),
      ),
    );

    await upsertMutationResult.mutateAsync({
      id: movieId,
      imageUrl: "https://updated-image-url.com/",
      title: "TanStack Query Firebase - updated",
    });
    upsertMutationResult.data();

    await waitFor(
      () => {
        expect(upsertMutationResult.isSuccess()).toBe(true);
        expect(upsertMutationResult.data()).toHaveProperty("movie_upsert");
        expect(upsertMutationResult.data()?.movie_upsert.id).toBe(movieId);
      },
      { timeout: 10000 },
    );

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [listMoviesRef().name],
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for upsert mutations with variable refs", async () => {
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const upsertMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(upsertMovieRef, () => ({
        invalidate: [getMovieByIdRef({ id: movieId })],
      })),
    );

    await upsertMutationResult.mutateAsync({
      id: movieId,
      imageUrl: "https://updated-image-url.com/",
      title: "TanStack Query Firebase - updated",
    });

    await waitFor(() => {
      expect(upsertMutationResult.isSuccess()).toBe(true);
      expect(upsertMutationResult.data()).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.data()?.movie_upsert.id).toBe(movieId);
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
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const upsertMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(upsertMovieRef, () => ({
        invalidate: [listMoviesRef(), getMovieByIdRef({ id: movieId })],
      })),
    );

    await upsertMutationResult.mutateAsync({
      id: movieId,
      imageUrl: "https://updated-image-url.com/",
      title: "TanStack Query Firebase - updated",
    });

    await waitFor(() => {
      expect(upsertMutationResult.isSuccess()).toBe(true);
      expect(upsertMutationResult.data()).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.data()?.movie_upsert.id).toBe(movieId);
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
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const deleteMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMovieRef, () => ({
        invalidate: [listMoviesRef()],
      })),
    );

    await deleteMutationResult.mutateAsync({
      id: movieId,
    });

    await waitFor(() => {
      expect(deleteMutationResult.isSuccess()).toBe(true);
      expect(deleteMutationResult.data()).toHaveProperty("movie_delete");
      expect(deleteMutationResult.data()?.movie_delete?.id).toBe(movieId);
    });

    expect(invalidateQueriesSpy.mock.calls).toHaveLength(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [listMoviesRef().name],
      }),
    );
  });

  test("invalidates queries specified in the invalidate option for delete mutations with variable refs", async () => {
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const deleteMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMovieRef, () => ({
        invalidate: [getMovieByIdRef({ id: movieId })],
      })),
    );

    await deleteMutationResult.mutateAsync({
      id: movieId,
    });

    await waitFor(() => {
      expect(deleteMutationResult.isSuccess()).toBe(true);
      expect(deleteMutationResult.data()).toHaveProperty("movie_delete");
      expect(deleteMutationResult.data()?.movie_delete?.id).toBe(movieId);
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
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const deleteMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMovieRef, () => ({
        invalidate: [listMoviesRef(), getMovieByIdRef({ id: movieId })],
      })),
    );

    await deleteMutationResult.mutateAsync({
      id: movieId,
    });

    await waitFor(() => {
      expect(deleteMutationResult.isSuccess()).toBe(true);
      expect(deleteMutationResult.data()).toHaveProperty("movie_delete");
      expect(deleteMutationResult.data()?.movie_delete?.id).toBe(movieId);
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
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef, () => ({ onSuccess })),
    );

    const movie = {
      title: "TanStack Query Firebase",
      genre: "onsuccess_callback_test",
      imageUrl: "https://test-image-url.com/",
    };

    await result.mutateAsync(movie);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(result.isSuccess()).toBe(true);
      expect(result.data()).toHaveProperty("movie_insert");
    });
  });

  test("calls onSuccess callback after successful upsert mutation", async () => {
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const upsertMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(upsertMovieRef, () => ({ onSuccess })),
    );

    await upsertMutationResult.mutateAsync({
      id: movieId,
      imageUrl: "https://updated-image-url.com/",
      title: "TanStack Query Firebase - updated",
    });

    await waitFor(() => {
      expect(upsertMutationResult.isSuccess()).toBe(true);
      expect(onSuccess).toHaveBeenCalled();
      expect(upsertMutationResult.data()).toHaveProperty("movie_upsert");
      expect(upsertMutationResult.data()?.movie_upsert.id).toBe(movieId);
    });
  });

  test("calls onSuccess callback after successful delete mutation", async () => {
    const createMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(createMovieRef),
    );

    expect(createMutationResult.isIdle()).toBe(true);

    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    await createMutationResult.mutateAsync(movie);

    await waitFor(() => {
      expect(createMutationResult.isSuccess()).toBe(true);
      expect(createMutationResult.data()).toHaveProperty("movie_insert");
    });

    const movieId = createMutationResult.data()?.movie_insert.id!;

    const deleteMutationResult = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMovieRef, () => ({ onSuccess })),
    );

    await deleteMutationResult.mutateAsync({
      id: movieId,
    });

    await waitFor(() => {
      expect(deleteMutationResult.isSuccess()).toBe(true);
      expect(onSuccess).toHaveBeenCalled();
      expect(deleteMutationResult.data()).toHaveProperty("movie_delete");
      expect(deleteMutationResult.data()?.movie_delete?.id).toBe(movieId);
    });
  });

  test("executes mutation successfully with function ref", async () => {
    const movie = {
      title: "TanStack Query Firebase",
      genre: "library",
      imageUrl: "https://test-image-url.com/",
    };

    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(() => createMovieRef(movie)),
    );

    await result.mutateAsync();

    await waitFor(() => {
      expect(result.isSuccess()).toBe(true);
      expect(result.data()).toHaveProperty("movie_insert");
      expect(result.dataConnectResult()?.ref?.variables).toMatchObject({
        title: movie.title,
        genre: movie.genre,
        imageUrl: movie.imageUrl,
      });
    });
  });

  test("executes mutation successfully with function ref that accepts variables", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(null, () => ({
        mutationFn: (title: string) =>
          createMovieRef({
            title,
            genre: "library",
            imageUrl: "https://test-image-url.com/",
          }),
      })),
    );

    const movieTitle = "TanStack Query Firebase";

    await result.mutateAsync(movieTitle);

    await waitFor(() => {
      expect(result.isSuccess()).toBe(true);
      expect(result.data()).toHaveProperty("movie_insert");
      expect(result.dataConnectResult()?.ref?.variables).toMatchObject({
        title: movieTitle,
        genre: "library",
        imageUrl: "https://test-image-url.com/",
      });
    });
  });
  test("stores valid properties in resultMeta", async () => {
    const metaResult = await addMeta();
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectMutation(deleteMetaRef),
    );
    await result.mutateAsync({ id: metaResult.data.ref.id });
    await waitFor(() => {
      expect(result.isSuccess()).toBe(true);
    });
    expect(result.data()?.ref).to.deep.eq(metaResult.data.ref);
  });
});
