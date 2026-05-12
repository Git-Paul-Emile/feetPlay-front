import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// ── Configuration Firebase ────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

function clearStaleFirebaseAuthStateIfExpressMode() {
  const mode = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_BACKEND_PROVIDER;
  if (mode !== "express") return;
  if (typeof window === "undefined") return;

  // Évite les lookup automatiques sur une session Firebase obsolète
  // quand l'app tourne en mode backend express.
  const keysToDelete: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("firebase:authUser:") || key.startsWith("firebase:pendingRedirect:")) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach((key) => window.localStorage.removeItem(key));
}

// ── Initialisation (évite la double init en HMR) ─────────────────────────────
clearStaleFirebaseAuthStateIfExpressMode();
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ── Services ──────────────────────────────────────────────────────────────────
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Analytics : optionnel
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {});
}
export { analytics };

export default app;
