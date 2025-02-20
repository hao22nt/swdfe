import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

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

// Đăng ký tài khoản
const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Đăng nhập bằng email
const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Đăng xuất
const logout = () => {
  return signOut(auth);
};

export { auth, googleProvider, signInWithPopup, registerWithEmail, loginWithEmail, logout };
