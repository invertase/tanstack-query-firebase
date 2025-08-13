import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { IdTokenExample } from "./components/IdTokenExample";

import "./firebase";

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Firebase Authentication Examples
            </h1>
            <p className="text-xl text-gray-600">
              TanStack Query Firebase Authentication hooks and patterns
            </p>
          </div>

          <div className="space-y-8">
            <IdTokenExample />
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500">
              Built with Vite, TanStack Query, and Firebase Auth
            </p>
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
