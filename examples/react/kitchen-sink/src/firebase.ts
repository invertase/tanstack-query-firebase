import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

if (getApps().length === 0) {
  initializeApp({
    projectId: "demo-test-project",
    apiKey: "demo-api-key", // Required for Firebase to initialize
  });

  // Connect to emulators if running locally
  if (import.meta.env.DEV) {
    try {
      // Connect to Auth emulator
      const auth = getAuth();
      connectAuthEmulator(auth, "http://localhost:9099");
      console.log("Connected to Firebase Auth emulator");

      // Connect to Firestore emulator
      const firestore = getFirestore();
      connectFirestoreEmulator(firestore, "localhost", 8080);
      console.log("Connected to Firebase Firestore emulator");
    } catch (error) {
      console.warn("Could not connect to Firebase emulators:", error);
    }
  }
}
