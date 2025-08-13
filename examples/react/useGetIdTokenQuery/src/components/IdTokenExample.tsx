import { useGetIdTokenQuery } from "@tanstack-query-firebase/react/auth";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export function IdTokenExample() {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [previousToken, setPreviousToken] = useState<string | null>(null);
  const [lastForceRefreshTime, setLastForceRefreshTime] = useState<Date | null>(
    null,
  );

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, [auth]);

  // Cached token query
  const {
    data: token,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetIdTokenQuery(user);

  // Force refresh query
  const {
    data: freshToken,
    isLoading: isFreshLoading,
    refetch: refetchFresh,
  } = useGetIdTokenQuery(user, {
    auth: { forceRefresh: true },
    enabled: false, // Manual trigger only
  });

  // Track token changes and log for debugging
  useEffect(() => {
    if (token) {
      console.log(
        "Token retrieved successfully:",
        `${token.substring(0, 20)}...`,
      );

      // Check if token changed
      if (previousToken && previousToken !== token) {
        console.log("Token changed after refresh!");
      }

      setPreviousToken(token);
    }
  }, [token, previousToken]);

  useEffect(() => {
    if (error) {
      console.error("Token retrieval failed:", error.message);
    }
  }, [error]);

  const handleSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleRefreshToken = () => {
    setRefreshCount((prev) => prev + 1);
    setLastRefreshTime(new Date());
    refetch();
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Firebase ID Token Example
        </h2>
        <p className="text-gray-600 mb-6">Sign in to see your ID token</p>
        <button
          onClick={handleSignIn}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Sign In Anonymously
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Firebase ID Token Example
        </h2>
        <p className="text-gray-600 mb-4">User ID: {user.uid}</p>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-6">
        {/* Cached Token */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cached Token
          </h3>
          {isLoading ? (
            <p className="text-gray-600">Loading cached token...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error.message}</p>
          ) : (
            <div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-mono text-xs">
                  Token hash: {token ? `${btoa(token).slice(0, 16)}...` : ""}
                </p>
                {lastRefreshTime && (
                  <div className="space-y-1">
                    <p className="text-xs text-blue-600">
                      Last refreshed: {lastRefreshTime.toLocaleTimeString()}
                      (Refresh #{refreshCount})
                    </p>
                    {previousToken && previousToken !== token && (
                      <p className="text-xs text-green-600 font-medium">
                        ✅ Token changed after refresh!
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={handleRefreshToken}
                  disabled={isFetching}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {isFetching ? "Refreshing..." : "Refresh Token"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fresh Token */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fresh Token (Force Refresh)
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Forces a token refresh from Firebase. Note: Firebase may return the
            same token if it's still valid (tokens last 1 hour).
          </p>
          {isFreshLoading ? (
            <p className="text-gray-600">Loading fresh token...</p>
          ) : freshToken ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-mono text-xs">
                Token hash:{" "}
                {freshToken ? `${btoa(freshToken).slice(0, 16)}...` : ""}
              </p>
              {lastForceRefreshTime && (
                <p className="text-xs text-blue-600">
                  Last force refresh:{" "}
                  {lastForceRefreshTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          ) : null}
          <button
            onClick={() => {
              refetchFresh();
              setLastForceRefreshTime(new Date());
            }}
            disabled={isFreshLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 mt-3"
          >
            {isFreshLoading ? "Loading..." : "Force Refresh Token"}
          </button>
        </div>

        {/* Token Comparison */}
        {token && freshToken && (
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Token Comparison
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={
                    token === freshToken ? "text-green-600" : "text-orange-600"
                  }
                >
                  {token === freshToken ? "✅ Identical" : "⚠️ Different"}
                </span>
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  Cached token hash:{" "}
                  {token ? `${btoa(token).slice(0, 16)}...` : "N/A"}
                </p>
                <p>
                  Fresh token hash:{" "}
                  {freshToken ? `${btoa(freshToken).slice(0, 16)}...` : "N/A"}
                </p>
                <p>
                  Token lengths: Cached ({token?.length || 0} chars), Fresh (
                  {freshToken?.length || 0} chars)
                </p>
              </div>

              {/* Token Diff */}
              {token && freshToken && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Full Token Diff:
                  </p>
                  <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">
                    {(() => {
                      const result = [];
                      const maxLength = Math.max(
                        token.length,
                        freshToken.length,
                      );

                      for (let i = 0; i < maxLength; i++) {
                        if (
                          i >= token.length ||
                          i >= freshToken.length ||
                          token[i] !== freshToken[i]
                        ) {
                          result.push(
                            <span
                              key={i}
                              className="bg-yellow-300 text-red-600 font-bold"
                            >
                              {freshToken[i] || "∅"}
                            </span>,
                          );
                        } else {
                          result.push(
                            <span key={i} className="text-gray-600">
                              {token[i]}
                            </span>,
                          );
                        }
                      }

                      return result;
                    })()}
                  </div>
                  {token !== freshToken && (
                    <p className="text-xs text-orange-600 mt-1">
                      Highlighted characters show differences between tokens
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
