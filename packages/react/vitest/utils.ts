import { type FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import { type Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectDataConnectEmulator,
  getDataConnect,
} from "firebase/data-connect";
import {
  connectFirestoreEmulator,
  type Firestore,
  getFirestore,
} from "firebase/firestore";
import { expect } from "vitest";
import { connectorConfig } from "@/dataconnect/default-connector";

const firebaseTestingOptions = {
  projectId: "test-project",
  apiKey: "test-api-key",
  authDomain: "test-auth-domain",
};

let firebaseApp: FirebaseApp | undefined;
let firestore: Firestore;
let auth: Auth;

if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseTestingOptions);
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);

  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectDataConnectEmulator(
    getDataConnect(connectorConfig),
    "localhost",
    9399,
  );
}

async function wipeFirestore() {
  const response = await fetch(
    "http://localhost:8080/emulator/v1/projects/test-project/databases/(default)/documents",
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to wipe firestore");
  }
}

async function wipeAuth() {
  const response = await fetch(
    "http://localhost:9099/emulator/v1/projects/test-project/accounts",
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to wipe auth");
  }
}

function expectFirestoreError(error: unknown, expectedCode: string) {
  if (error instanceof FirebaseError) {
    expect(error).toBeDefined();
    expect(error.code).toBeDefined();
    expect(error.code).toBe(expectedCode);
  } else {
    throw new Error(
      "Expected a Firestore error, but received a different type.",
    );
  }
}

function expectFirebaseError(error: unknown, expectedCode: string) {
  if (error instanceof FirebaseError) {
    expect(error).toBeDefined();
    expect(error.code).toBeDefined();
    expect(error.code).toBe(expectedCode);
  } else {
    console.error("Expected a Firebase error, but received a different type.", {
      receivedType: typeof error,
      errorDetails:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    throw new Error(
      "Expected a Firebase error, but received a different type.",
    );
  }
}

export {
  firestore,
  wipeFirestore,
  expectFirestoreError,
  firebaseTestingOptions,
  auth,
  wipeAuth,
  firebaseApp,
  expectFirebaseError,
};
