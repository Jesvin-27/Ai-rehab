// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAe4IAj45dyGnb9cTw6BQpYFru1fk1-mE4",
  authDomain: "ai-rehab-349a4.firebaseapp.com",
  projectId: "ai-rehab-349a4",
  storageBucket: "ai-rehab-349a4.firebasestorage.app",
  messagingSenderId: "909919340046",
  appId: "1:909919340046:web:f2b1b370ca702e20aede5f",
  measurementId: "G-8FVQGJ8LC3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export const db = getFirestore(app);
