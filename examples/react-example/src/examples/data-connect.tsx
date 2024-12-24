"use client";

import { createMovieRef, listMoviesRef } from "@dataconnect/default-connector";
import {
	useDataConnectMutation,
	useDataConnectQuery,
} from "@tanstack-query-firebase/react/data-connect";

import "@/firebase";

export function Movies() {
	const movies = useDataConnectQuery(listMoviesRef());

	const addMovie = useDataConnectMutation(createMovieRef, {
		invalidate: [listMoviesRef],
	});

	if (movies.isLoading) {
		return <div>Loading...</div>;
	}

	if (movies.isError) {
		return <div>Error: {movies.error.message}</div>;
	}

	return (
		<div>
			<h1>Movies</h1>
			<button
				disabled={addMovie.isPending}
				onClick={() => {
					addMovie.mutate({
						title: Math.random().toString(32),
						genre: "Action",
						imageUrl: "https://example.com/image.jpg",
					});
				}}
			>
				Add Movie
			</button>
			<ul>
				<li>Fetch Time: {movies.data?.fetchTime}</li>
				<li>Source: {movies.data?.source}</li>
				<li>
					Query Key: {movies.data?.ref.name} + {movies.data?.ref.variables}
				</li>
				{movies.data!.movies.map((movie) => (
					<li key={movie.id}>{movie.title}</li>
				))}
			</ul>
		</div>
	);
}
