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
  apiKey: "AIzaSyB95ouD42m0RgdUwzbbKqL3qX3Do0UOf24",
  authDomain: "collegeadmissionhelper.firebaseapp.com",
  databaseURL: "https://collegeadmissionhelper-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "collegeadmissionhelper",
  storageBucket: "collegeadmissionhelper.firebasestorage.app",
  messagingSenderId: "730631426052",
  appId: "1:730631426052:web:f514eb6214a048dd7de551"
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
