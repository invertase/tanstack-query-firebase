import React from "react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { auth, wipeAuth } from "~/testing-utils";
import { createUserWithEmailAndPassword, type User } from "firebase/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useLinkWithCredentialMutation", () => {
  const email = "tqf@invertase.io";
  const password = "TanstackQueryFirebase#123";
  let user: User;

  beforeEach(async () => {
    queryClient.clear();
    await wipeAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await auth.signOut();
  });

  test("", async () => {});
});
