import { listMoviesRef } from "@dataconnect/default-connector";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { executeQuery } from "firebase/data-connect";
import { Movies } from "@/examples/data-connect";

import "@/firebase";

// Force dynamic rendering to avoid build-time Firebase calls
export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const queryClient = new QueryClient();
  const result = await executeQuery(listMoviesRef());

  queryClient.setQueryData(
    [result.ref.name, result.ref.variables],
    result.data,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Movies />
    </HydrationBoundary>
  );
}
