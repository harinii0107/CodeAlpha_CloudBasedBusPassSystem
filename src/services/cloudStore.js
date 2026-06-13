import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

export async function saveBookingToCloud(booking) {
  if (!db) {
    saveOffline(booking);
    return { ok: false, mode: "offline" };
  }

  try {
    await addDoc(collection(db, "bookings"), {
      ...booking,
      createdAt: serverTimestamp()
    });
    return { ok: true, mode: "firebase" };
  } catch (error) {
    saveOffline({ ...booking, syncError: error.message });
    return { ok: false, mode: "offline" };
  }
}

function saveOffline(booking) {
  const key = "codealpha_bus_pass_bookings";
  const current = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([booking, ...current].slice(0, 25)));
}
