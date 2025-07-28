import { dehydrate } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { executeQuery } from "firebase/data-connect";
import { beforeEach, describe, expect, test } from "vitest";
import {
  createMovie,
  getMovieByIdRef,
  listMoviesRef,
} from "@/dataconnect/default-connector";
import { firebaseApp } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { DataConnectQueryClient } from "./query-client";
import { useDataConnectQuery } from "./useDataConnectQuery";

// initialize firebase app
firebaseApp;

describe("useDataConnectQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
  });

  test("returns pending state initially", async () => {
    const { result } = renderHook(() => useDataConnectQuery(listMoviesRef()), {
      wrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.status).toBe("pending");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  test("fetches data successfully", async () => {
    const { result } = renderHook(() => useDataConnectQuery(listMoviesRef()), {
      wrapper,
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveProperty("movies");
    expect(Array.isArray(result.current.data?.movies)).toBe(true);
    expect(result.current.data?.movies.length).toBeGreaterThanOrEqual(0);
  });

  test("refetches data successfully", async () => {
    const { result } = renderHook(() => useDataConnectQuery(listMoviesRef()), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBeDefined();
      expect(result.current.dataConnectResult).toHaveProperty("ref");
      expect(result.current.dataConnectResult).toHaveProperty("source");
      expect(result.current.dataConnectResult).toHaveProperty("fetchTime");
    });

    // const initialFetchTime = result.current?.dataConnectResult?.fetchTime;

    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay before refetching

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBeDefined();
      expect(result.current?.dataConnectResult).toHaveProperty("ref");
      expect(result.current?.dataConnectResult).toHaveProperty("source");
      expect(result.current.dataConnectResult).toHaveProperty("fetchTime");
      expect(result.current.data).toHaveProperty("movies");
      expect(Array.isArray(result.current.data?.movies)).toBe(true);
      expect(result.current.data?.movies.length).toBeGreaterThanOrEqual(0);
    });

    // const refetchTime = result.current?.dataConnectResult?.fetchTime;
  });

  test("returns correct data", async () => {
    await createMovie({
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    });
    const { result } = renderHook(() => useDataConnectQuery(listMoviesRef()), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.movies).toBeDefined();
    expect(Array.isArray(result.current.data?.movies)).toBe(true);

    const movie = result.current.data?.movies.find(
      (m) => m.title === "tanstack query firebase",
    );

    expect(movie).toBeDefined();
    expect(movie).toHaveProperty("title", "tanstack query firebase");
    expect(movie).toHaveProperty("genre", "library");
    expect(movie).toHaveProperty("imageUrl", "https://invertase.io/");
  });

  test("returns the correct data properties", async () => {
    await createMovie({
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    });
    const { result } = renderHook(() => useDataConnectQuery(listMoviesRef()), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.data?.movies.forEach((i) => {
      expect(i).toHaveProperty("title");
      expect(i).toHaveProperty("genre");
      expect(i).toHaveProperty("imageUrl");
    });
  });

  test("fetches data by unique identifier", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };
    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const { result } = renderHook(
      () => useDataConnectQuery(getMovieByIdRef({ id: movieId })),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.movie?.title).toBe(movieData?.title);
      expect(result.current.data?.movie?.genre).toBe(movieData?.genre);
      expect(result.current.data?.movie?.imageUrl).toBe(movieData?.imageUrl);
    });
  });

  test("returns flattened data including ref, source, and fetchTime", async () => {
    const { result } = renderHook(() => useDataConnectQuery(listMoviesRef()), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.dataConnectResult).toHaveProperty("ref");
    expect(result.current.dataConnectResult).toHaveProperty("source");
    expect(result.current.dataConnectResult).toHaveProperty("fetchTime");
  });

  test("returns flattened data including ref, source, and fetchTime for queries with unique identifier", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };
    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const { result } = renderHook(
      () => useDataConnectQuery(getMovieByIdRef({ id: movieId })),
      {
        wrapper,
      },
    );

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.dataConnectResult).toHaveProperty("ref");
    expect(result.current.dataConnectResult).toHaveProperty("source");
    expect(result.current.dataConnectResult).toHaveProperty("fetchTime");
  });

  test("avails the data immediately when QueryResult is passed", async () => {
    const queryResult = await executeQuery(listMoviesRef());

    const { result } = renderHook(() => useDataConnectQuery(queryResult), {
      wrapper,
    });

    // Should not enter a loading state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPending).toBe(false);

    expect(result.current.isSuccess).toBe(true);

    expect(result.current.data).toBeDefined();
    expect(result.current.dataConnectResult).toHaveProperty("ref");
    expect(result.current.dataConnectResult).toHaveProperty("source");
    expect(result.current.dataConnectResult).toHaveProperty("fetchTime");
  });
  test("avails the data immediately when initialData is passed", async () => {
    const queryResult = await executeQuery(listMoviesRef());

    const { result } = renderHook(
      () =>
        useDataConnectQuery(listMoviesRef(), { initialData: queryResult.data }),
      {
        wrapper,
      },
    );

    // Should not enter a loading state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPending).toBe(false);

    expect(result.current.isSuccess).toBe(true);

    expect(result.current.data).toBeDefined();
    expect(result.current.data).to.deep.eq(queryResult.data);
    expect(result.current.dataConnectResult).toHaveProperty("ref");
  });

  test("a query with no variables has null as the second query key argument", async () => {
    const queryClient = new DataConnectQueryClient();

    await queryClient.prefetchDataConnectQuery(listMoviesRef());

    const dehydrated = dehydrate(queryClient);

    expect(dehydrated.queries[0].queryKey).toEqual(["ListMovies", null]);
  });

  test("a query with variables has valid query keys including the variables", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };

    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const queryClient = new DataConnectQueryClient();

    await queryClient.prefetchDataConnectQuery(
      getMovieByIdRef({ id: movieId }),
    );

    const dehydrated = dehydrate(queryClient);

    expect(dehydrated.queries[0].queryKey).toEqual([
      "GetMovieById",
      { id: movieId },
    ]);
  });

  test("fetches new data when variables change", async () => {
    const movieData1 = {
      title: "tanstack query firebase 1",
      genre: "library 1",
      imageUrl: "https://invertase.io/1",
    };
    const createdMovie = await createMovie(movieData1);
    const movieData2 = {
      title: "tanstack query firebase 2",
      genre: "library 2",
      imageUrl: "https://invertase.io/2",
    };
    const createdMovie2 = await createMovie(movieData2);

    const movieId = createdMovie?.data?.movie_insert?.id;
    const movieId2 = createdMovie2?.data?.movie_insert?.id;
    getMovieByIdRef({ id: movieId2 });
    const ref = getMovieByIdRef({ id: movieId });
    const { result } = renderHook(() => useDataConnectQuery(ref), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.movie?.title).toBe(movieData1?.title);
      expect(result.current.data?.movie?.genre).toBe(movieData1?.genre);
      expect(result.current.data?.movie?.imageUrl).toBe(movieData1?.imageUrl);
    });
    await act(async () => {
      ref.variables.id = createdMovie2.data.movie_insert.id;
      result.current.refetch();
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.movie?.title).toBe(movieData2?.title);
      expect(result.current.data?.movie?.genre).toBe(movieData2?.genre);
      expect(result.current.data?.movie?.imageUrl).toBe(movieData2?.imageUrl);
    });
  });
});
