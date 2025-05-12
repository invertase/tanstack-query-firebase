import { Movies } from "@/examples/data-connect";
import { listMoviesRef } from "@dataconnect/default-connector";
import { executeQuery } from "firebase/data-connect";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import "@/firebase";

export default async function PostsPage() {
	const queryClient = new QueryClient();
	const result = await executeQuery(listMoviesRef());
	
	queryClient.setQueryData([result.ref.name, result.ref.variables], result.data);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Movies />
		</HydrationBoundary>
	);
}
