import { describe, expect, test, beforeEach } from "vitest";
import { useConnectQuery } from "./useConnectQuery";
import { renderHook, waitFor } from "@testing-library/react";
import {
  listMoviesRef,
  createMovie,
  getMovieByIdRef,
} from "@/dataconnect/default-connector";
import { firebaseApp } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { executeQuery } from "firebase/data-connect";

// initialize firebase app
firebaseApp;

describe("useConnectQuery", () => {
  beforeEach(async () => {
    queryClient.clear();
  });

  test("returns pending state initially", async () => {
    const { result } = renderHook(() => useConnectQuery(listMoviesRef()), {
      wrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.status).toBe("pending");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  test("fetches data successfully", async () => {
    const { result } = renderHook(() => useConnectQuery(listMoviesRef()), {
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
    const { result } = renderHook(() => useConnectQuery(listMoviesRef()), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.refetch();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveProperty("movies");
    expect(Array.isArray(result.current.data?.movies)).toBe(true);
    expect(result.current.data?.movies.length).toBeGreaterThanOrEqual(0);
  });

  test("returns correct data", async () => {
    const { result } = renderHook(() => useConnectQuery(listMoviesRef()), {
      wrapper,
    });

    await createMovie({
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.movies).toBeDefined();
    expect(Array.isArray(result.current.data?.movies)).toBe(true);

    const movie = result.current.data?.movies.find(
      (m) => m.title === "tanstack query firebase"
    );

    expect(movie).toBeDefined();
    expect(movie).toHaveProperty("title", "tanstack query firebase");
    expect(movie).toHaveProperty("genre", "library");
    expect(movie).toHaveProperty("imageUrl", "https://invertase.io/");
  });

  test("returns the correct data properties", async () => {
    const { result } = renderHook(() => useConnectQuery(listMoviesRef()), {
      wrapper,
    });

    await createMovie({
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
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
      () => useConnectQuery(getMovieByIdRef({ id: movieId })),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.movie?.title).toBe(movieData?.title);
      expect(result.current.data?.movie?.genre).toBe(movieData?.genre);
      expect(result.current.data?.movie?.imageUrl).toBe(movieData?.imageUrl);
    });
  });

  test("returns flattened data including ref, source, and fetchTime", async () => {
    const { result } = renderHook(() => useConnectQuery(listMoviesRef()), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveProperty("ref");
    expect(result.current.data).toHaveProperty("source");
    expect(result.current.data).toHaveProperty("fetchTime");
  });

  test("avails the data immediately when QueryResult is passed", async () => {
    const queryResult = await executeQuery(listMoviesRef());

    const { result } = renderHook(() => useConnectQuery(queryResult), {
      wrapper,
    });

    // Should not enter a loading state
    expect(result.current.isLoading).toBe(false);
    
    expect(result.current.isSuccess).toBe(true);

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveProperty("ref");
    expect(result.current.data).toHaveProperty("source");
    expect(result.current.data).toHaveProperty("fetchTime");
  });
});
