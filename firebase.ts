/** Inicializa una sola instancia de Firebase. La configuración cliente es pública; las reglas protegen los datos. */
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { configureAppCheck } from './security/appCheck';

const firebaseConfig = {
  apiKey: "AIzaSyB8tjj8d1qFFU860bNioC02bbLq_Fr9IUc",
  authDomain: "super-ahorro-app.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "super-ahorro-app",
  storageBucket: "super-ahorro-app.firebasestorage.app",
  messagingSenderId: "175580172771",
  appId: "1:175580172771:web:230fd51ceb905c6bc490d6"
};

const existing = getApps().length > 0;
export const app = existing ? getApp() : initializeApp(firebaseConfig);
if (!existing) configureAppCheck(app);
export const db = getFirestore(app);

const usarEmuladores = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
const hostEmulador = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST?.trim() || '127.0.0.1';
if (usarEmuladores) {
  try { connectFirestoreEmulator(db, hostEmulador, 8080); }
  catch (error) {
    // Fast Refresh puede volver a evaluar este módulo con la conexión ya activa.
    if (!(error instanceof Error) || !error.message.toLowerCase().includes('already')) throw error;
  }
}
