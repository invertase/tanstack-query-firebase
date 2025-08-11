import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

if (getApps().length === 0) {
  initializeApp({
    projectId: "example",
    apiKey: "demo-api-key", // Required for Firebase to initialize
  });

  // Connect to Auth emulator if running locally
  if (import.meta.env.DEV) {
    try {
      const auth = getAuth();
      connectAuthEmulator(auth, "http://localhost:9099");
      console.log("Connected to Firebase Auth emulator");
    } catch (error) {
      console.warn("Could not connect to Firebase Auth emulator:", error);
    }
  }
}
