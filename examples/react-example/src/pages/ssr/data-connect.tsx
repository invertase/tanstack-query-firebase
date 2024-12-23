import { listMoviesRef } from "@dataconnect/default-connector";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { Movies } from "@/examples/data-connect";
import { DataConnectQueryClient } from "@tanstack-query-firebase/react/data-connect";
import type { InferGetStaticPropsType } from "next";

export async function getStaticProps() {
	const queryClient = new DataConnectQueryClient();

	await queryClient.prefetchDataConnectQuery(listMoviesRef());

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}

export default function MoviesRoute({
	dehydratedState,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<HydrationBoundary state={dehydratedState}>
			<Movies />
		</HydrationBoundary>
	);
}
