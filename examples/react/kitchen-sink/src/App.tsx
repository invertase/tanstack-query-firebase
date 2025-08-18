import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { CollectionQueryExample } from "./components/CollectionQueryExample";
import { IdTokenExample } from "./components/IdTokenExample";
import { NestedCollectionsExample } from "./components/NestedCollectionsExample";
import { WithConverterExample } from "./components/WithConverterExample";

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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/id-token" element={<IdTokenExample />} />
              <Route
                path="/firestore/collection-query"
                element={<CollectionQueryExample />}
              />
              <Route
                path="/nested-collections"
                element={<NestedCollectionsExample />}
              />
              <Route
                path="/typescript-safety"
                element={<WithConverterExample />}
              />
            </Routes>
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-lg font-semibold ${
                isActive("/") ? "text-blue-600" : "text-gray-900"
              }`}
            >
              TanStack Query Firebase Examples
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/auth/id-token"
              className={`text-sm font-medium ${
                isActive("/auth/id-token")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Auth: ID Token
            </Link>
            <Link
              to="/firestore/collection-query"
              className={`text-sm font-medium ${
                isActive("/firestore/collection-query")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Firestore: Collection Query
            </Link>
            <Link
              to="/nested-collections"
              className={`text-sm font-medium ${
                isActive("/nested-collections")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Nested Collections
            </Link>
            <Link
              to="/typescript-safety"
              className={`text-sm font-medium ${
                isActive("/typescript-safety")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              TypeScript Safety
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        TanStack Query Firebase Examples
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Explore different patterns and use cases for Firebase with TanStack
        Query
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/auth/id-token"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Auth: ID Token
          </h2>
          <p className="text-gray-600 text-sm">
            Get and refresh Firebase ID tokens with proper caching
          </p>
        </Link>
        <Link
          to="/firestore/collection-query"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Firestore: Collection Query
          </h2>
          <p className="text-gray-600 text-sm">
            Query Firestore collections with filtering and mutations
          </p>
        </Link>
        <Link
          to="/nested-collections"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Nested Collections
          </h2>
          <p className="text-gray-600 text-sm">
            Handle nested Firestore collections with real-time updates
          </p>
        </Link>
        <Link
          to="/typescript-safety"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            TypeScript Safety
          </h2>
          <p className="text-gray-600 text-sm">
            Resolve DocumentData vs custom interface type issues
          </p>
        </Link>
      </div>
    </div>
  );
}

export default App;
