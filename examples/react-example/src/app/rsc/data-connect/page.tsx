import { Movies } from "@/examples/data-connect";
import { listMoviesRef } from "@dataconnect/default-connector";
import { DataConnectQueryClient } from "@tanstack-query-firebase/react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import "@/firebase";

export default async function PostsPage() {
  const queryClient = new DataConnectQueryClient();

  await queryClient.prefetchDataConnectQuery(listMoviesRef());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Movies />
    </HydrationBoundary>
  );
}
