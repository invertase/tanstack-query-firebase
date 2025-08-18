import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { IdTokenExample } from "./components/IdTokenExample";
import { CollectionQueryExample } from "./components/CollectionQueryExample";

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
      })
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

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/auth/id-token", label: "ID Token Query" },
    { path: "/firestore/collection-query", label: "Collection Query" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">
              TanStack Query Firebase
            </h1>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        TanStack Query Firebase Examples
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Explore different Firebase hooks and patterns with TanStack Query
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication
          </h2>
          <p className="text-gray-600 mb-4">
            Examples of Firebase Authentication hooks including ID token
            management.
          </p>
          <Link
            to="/auth/id-token"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View ID Token Example
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Firestore</h2>
          <p className="text-gray-600 mb-4">
            Examples of Firestore hooks for querying collections and documents.
          </p>
          <Link
            to="/firestore/collection-query"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            View Collection Query Example
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Built with Vite, TanStack Query, React Router, and Firebase
        </p>
      </div>
    </div>
  );
}

export default App;
