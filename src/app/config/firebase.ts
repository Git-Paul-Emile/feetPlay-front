import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {});
}
export { analytics };

/** Attend que Firebase Auth ait résolu l'état initial (comme feeti2). */
export const authStateReady = async (): Promise<void> => {
  if (typeof window === "undefined") return;
  if ((auth as Auth & { _authStateReady?: Promise<void> })._authStateReady) {
    return (auth as Auth & { _authStateReady?: Promise<void> })._authStateReady;
  }

  const promise = new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      resolve();
      unsubscribe();
    });
  });

  (auth as Auth & { _authStateReady?: Promise<void> })._authStateReady = promise;
  return promise;
};

export default app;
