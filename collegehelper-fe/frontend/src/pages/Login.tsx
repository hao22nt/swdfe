import React, { useState } from "react";
import { GiLotusFlower } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post(
        "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/auth/login-google",
        { token: idToken }
      );

      // Đánh dấu user đăng nhập bằng Google
      localStorage.setItem('isGoogleUser', 'true');

      console.log("Backend Response:", response.data);
      toast.success(`Welcome ${result.user.displayName}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Chuyển hướng trực tiếp đến /user
      setTimeout(() => navigate("/user"), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng username & password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/auth/auth-account",
        { username, password }
      );
      const accessToken = response.data?.accessToken; // Lấy access token từ API
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken); // Lưu vào localStorage
      }

      // Đánh dấu không phải user Google
      localStorage.setItem('isGoogleUser', 'false');

      console.log("Backend Response:", response.data);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid username or password!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-base-200">
      <ToastContainer />
      <div className="w-full h-screen xl:h-auto xl:w-[30%] bg-base-100 rounded-lg shadow-md flex flex-col items-center p-5">
        <GiLotusFlower className="text-6xl text-primary animate-spin-slow" />
        <span className="text-xl font-semibold">Hello, 👋 Welcome Back!</span>

        <form onSubmit={handleLogin} className="w-full mt-5">
          <input 
            type="text"
            placeholder="Username"
            className="input input-bordered w-full mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">OR</div>

        {/* Đăng nhập bằng Google */}
        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-outline w-full mt-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
