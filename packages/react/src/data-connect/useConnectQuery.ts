import { useQuery } from "@tanstack/react-query";
import { type QueryRef, executeQuery } from "firebase/data-connect";

export function useConnectQuery<
  Data extends Record<string, any>,
  Variables = unknown
>(ref: QueryRef<Data, Variables>) {
  return useQuery<Data, Error>({
    queryKey: [ref.name],
    queryFn: async () => {
      const { data } = await executeQuery<Data, Variables>(ref);
      return data;
    },
  });
}
