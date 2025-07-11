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

// Validate that all required Firebase config keys are present
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

let app;
if (missingKeys.length > 0) {
  console.error(`Firebase initialization failed: Missing environment variables: ${missingKeys.join(', ')}`);
  // Handle the error appropriately in your app, e.g., show an error message
  // For now, we'll avoid initializing Firebase to prevent further errors.
} else {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}


const db = getFirestore(app);

export { db };
