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
      const decodedToken = decodeJWT(response.data?.accessToken);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toLowerCase();
      // Lưu token và role từ response API
      localStorage.setItem('accessToken', response.data?.accessToken);
      localStorage.setItem('isGoogleUser', 'true');
      localStorage.setItem('userRole', userRole);

      console.log('Google Login Info:', {
        user: result.user.displayName,
        email: result.user.email,
        role: userRole,
        isGoogleUser: true
      });

      toast.success(`Welcome ${result.user.displayName}!`);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm decode JWT
  const decodeJWT = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
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

      const accessToken = response.data?.accessToken;
      
      if (accessToken) {
        // Decode JWT token để lấy thông tin
        const decodedToken = decodeJWT(accessToken);
        console.log('Decoded Token:', decodedToken);

        // Lấy role từ decoded token
        const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toLowerCase();

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem('isGoogleUser', 'false');
        localStorage.setItem('userRole', userRole);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem('isGoogleUser', 'false');
        localStorage.setItem('userRole', userRole);

        console.log('Normal Login Info:', {
          username,
          role: userRole,
          decodedToken
        });

        toast.success("Login successful!");
        setTimeout(() => {
          if (userRole === 'admin') {
            navigate("/");
          } else {
            navigate("/user");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid username or password!");
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
