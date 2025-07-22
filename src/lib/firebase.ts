
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required Firebase config keys are present and are valid strings
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => typeof value !== 'string' || value.trim() === '')
  .map(([key]) => key);

let app;
let db;
let firebaseInitializationError: Error | null = null;

if (missingKeys.length > 0) {
  const errorMsg = `Firebase initialization failed. The following environment variables are missing or invalid in your .env file: ${missingKeys.join(', ')}. Please make sure they are all set correctly.`;
  firebaseInitializationError = new Error(errorMsg);
} else {
  // All keys are present, proceed with initialization
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (e) {
    firebaseInitializationError = e instanceof Error ? e : new Error("An unknown error occurred during Firebase initialization.");
  }
}

if (firebaseInitializationError && typeof window !== 'undefined') {
  console.error(firebaseInitializationError.message);
} else if (firebaseInitializationError) {
  throw firebaseInitializationError;
}

export { db, firebaseInitializationError };
