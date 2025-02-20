// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0rqzq34MjnqEcESUnJyyXnAVuNY8S5kI",
  authDomain: "addmission-d9b6e.firebaseapp.com",
  projectId: "addmission-d9b6e",
  storageBucket: "addmission-d9b6e.firebasestorage.app",
  messagingSenderId: "457110151915",
  appId: "1:457110151915:web:3e843ca0bd122f971a14ae"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
