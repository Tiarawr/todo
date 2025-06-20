import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators if in development and not connected
if (process.env.NODE_ENV === "development") {
  try {
    // Only connect if not already connected
    if (!auth._delegate._config.emulator) {
      connectAuthEmulator(auth, "http://localhost:9099");
    }
  } catch (error) {
    // Emulator already connected or not available
    console.log("Auth emulator connection skipped");
  }

  try {
    // Only connect if not already connected
    if (!db._delegate._databaseId.database.includes("localhost")) {
      connectFirestoreEmulator(db, "localhost", 8080);
    }
  } catch (error) {
    // Emulator already connected or not available
    console.log("Firestore emulator connection skipped");
  }
}

export { auth, db };
