import { provideHttpClient } from "@angular/common/http";
import {
  inject,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import {
  connectDataConnectEmulator,
  DataConnect,
  getDataConnect,
  provideDataConnect,
} from "@angular/fire/data-connect";
import {
  provideTanStackQuery,
  QueryClient,
} from "@tanstack/angular-query-experimental";
import { waitFor } from "@testing-library/angular";
import { beforeEach, describe, expect, test } from "vitest";
import {
  connectorConfig,
  createMovie,
  getMovieByIdRef,
  listMoviesRef,
} from "@/dataconnect/default-connector";
import { injectDataConnectQuery } from "./index";

// initialize firebase app
initializeApp({ projectId: "p" });

describe("injectDataConnectQuery", () => {
  const queryClient: QueryClient = new QueryClient();
  let dc: DataConnect;
  beforeEach(async () => {
    queryClient.clear();
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
    dc = TestBed.runInInjectionContext(() => inject(DataConnect));
  });

  test("returns pending state initially", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(listMoviesRef(dc)),
    );

    expect(result.isPending()).toBe(true);
    expect(result.status()).toBe("pending");

    await waitFor(() => expect(result.isSuccess()).toBe(true));

    expect(result.data()).toBeDefined();
  });

  test("fetches data successfully", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(listMoviesRef(dc)),
    );

    expect(result.isPending()).toBe(true);

    await waitFor(() => expect(result.isSuccess()).toBe(true));

    expect(result.data()).toBeDefined();
    expect(result.data()).toHaveProperty("movies");
    expect(Array.isArray(result.data()?.movies)).toBe(true);
    expect(result.data()?.movies.length).toBeGreaterThanOrEqual(0);
  });

  test("refetches data successfully", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(listMoviesRef(dc)),
    );

    await waitFor(() => {
      expect(result.isSuccess()).toBe(true);
      expect(result.data()).toBeDefined();
      expect(result.dataConnectResult()).toHaveProperty("ref");
      expect(result.dataConnectResult()).toHaveProperty("source");
      expect(result.dataConnectResult()).toHaveProperty("fetchTime");
    });

    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay before refetching

    result.refetch();

    await waitFor(() => {
      expect(result.isSuccess()).toBe(true);
      expect(result.data()).toBeDefined();
      expect(result.dataConnectResult()).toHaveProperty("ref");
      expect(result.dataConnectResult()).toHaveProperty("source");
      expect(result.dataConnectResult()).toHaveProperty("fetchTime");
      expect(result.data()).toHaveProperty("movies");
      expect(Array.isArray(result.data()?.movies)).toBe(true);
      expect(result.data()?.movies.length).toBeGreaterThanOrEqual(0);
    });
  });

  test("returns correct data", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(listMoviesRef(dc)),
    );

    await createMovie({
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    });

    await waitFor(() => expect(result.isSuccess()).toBe(true));

    expect(result.data()).toBeDefined();
    expect(result.data()?.movies).toBeDefined();
    expect(Array.isArray(result.data()?.movies)).toBe(true);

    const movie = result
      .data()
      ?.movies.find((m) => m.title === "tanstack query firebase");

    expect(movie).toBeDefined();
    expect(movie).toHaveProperty("title", "tanstack query firebase");
    expect(movie).toHaveProperty("genre", "library");
    expect(movie).toHaveProperty("imageUrl", "https://invertase.io/");
  });

  test("returns the correct data properties", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(listMoviesRef(dc)),
    );

    await createMovie({
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    });

    await waitFor(() => expect(result.isSuccess()).toBe(true));

    result.data()?.movies.forEach((i) => {
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

    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(getMovieByIdRef({ id: movieId })),
    );

    await waitFor(() => {
      expect(result.isSuccess()).toBe(true);
      expect(result.data()?.movie?.title).toBe(movieData?.title);
      expect(result.data()?.movie?.genre).toBe(movieData?.genre);
      expect(result.data()?.movie?.imageUrl).toBe(movieData?.imageUrl);
    });
  });

  test("returns flattened data including ref, source, and fetchTime", async () => {
    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(listMoviesRef(dc)),
    );

    expect(result.isLoading()).toBe(true);

    await waitFor(() => expect(result.isSuccess()).toBe(true));

    expect(result.data()).toBeDefined();
    expect(result.dataConnectResult()).toHaveProperty("ref");
    expect(result.dataConnectResult()).toHaveProperty("source");
    expect(result.dataConnectResult()).toHaveProperty("fetchTime");
  });

  test("returns flattened data including ref, source, and fetchTime for queries with unique identifier", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };
    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(getMovieByIdRef({ id: movieId })),
    );

    expect(result.isPending()).toBe(true);

    await waitFor(() => expect(result.isSuccess()).toBe(true));

    expect(result.data()).toBeDefined();
    expect(result.dataConnectResult()).toHaveProperty("ref");
    expect(result.dataConnectResult()).toHaveProperty("source");
    expect(result.dataConnectResult()).toHaveProperty("fetchTime");
  });
  test("Effect is properly computed", async () => {
    const movieData = {
      title: "tanstack query firebase",
      genre: "library",
      imageUrl: "https://invertase.io/",
    };
    const createdMovie = await createMovie(movieData);

    const movieId = createdMovie?.data?.movie_insert?.id;

    const result = TestBed.runInInjectionContext(() =>
      injectDataConnectQuery(getMovieByIdRef({ id: movieId })),
    );

    expect(result.isPending()).toBe(true);

    await waitFor(() => expect(result.isSuccess()).toBe(true));
    expect(result.data()).toBeDefined();
    expect(result.dataConnectResult()?.ref).toBeDefined();
    // // const r = await TestBed.runInInjectionContext(async () => {

    // //   return new Promise((resolve, reject) => {
    // //     effect(() => resolve(result.ref!));
    // //     // expect(result).toHaveProperty("ref");
    // //     // expect(result).toHaveProperty("source");
    // //     // expect(result).toHaveProperty("fetchTime");
    // //   });
    // // })
    // expect(r).toBeDefined();
  });
});
