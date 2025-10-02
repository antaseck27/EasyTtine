// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQQa-v3Zg-HNwKoNDiTGYrfyXX7SnIiGM",
  authDomain: "tontine-easy.firebaseapp.com",
  projectId: "tontine-easy",
  storageBucket: "tontine-easy.appspot.com",
  messagingSenderId: "138013449509",
  appId: "1:138013449509:web:a7e8b5462449f77e7f8ecc"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exports utilisables dans tout ton projet
export const auth = getAuth(app);
export const db = getFirestore(app);

// Debug optionnel (visible dans la console du navigateur)
window._fb = { app, auth, db };
