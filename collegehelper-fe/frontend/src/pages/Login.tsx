import React, { useState } from "react";
import ChangeThemes from "../components/ChangesThemes";
import { GiLotusFlower } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      console.log("User Info:", result.user);

      toast.success(`Welcome ${result.user.displayName}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);

      toast.success(`Welcome ${userCredential.user.email}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        toast.error("Invalid email or password. Please try again!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error("An unknown error occurred:", error);
        toast.error("Something went wrong. Please try again!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <ToastContainer />
      <div className="w-full min-h-screen flex justify-center items-center bg-base-200 relative">
        <div className="absolute top-5 right-5 z-[99]">
          <ChangeThemes />
        </div>
        <div className="w-full h-screen xl:h-auto xl:w-[30%] 2xl:w-[25%] 3xl:w-[20%] bg-base-100 rounded-lg shadow-md flex flex-col items-center p-5 pb-7 gap-8 pt-20 xl:pt-7">
          <div className="flex items-center gap-1 xl:gap-2">
            <GiLotusFlower className="text-4xl sm:text-4xl xl:text-6xl 2xl:text-6xl text-primary animate-spin-slow -ml-3" />
            <span className="text-[18px] leading-[1.2] sm:text-lg xl:text-3xl 2xl:text-3xl font-semibold text-base-content dark:text-neutral-200">
              Login
            </span>
          </div>
          <span className="xl:text-xl font-semibold">Hello, 👋 Welcome Back!</span>
          <div className="w-full flex flex-col items-stretch gap-3">
            <label className="input input-bordered min-w-full flex items-center gap-2">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                placeholder="Email"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                placeholder="Password"
              />
            </label>
            <div className="flex items-center justify-between">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox w-4 h-4 rounded-md checkbox-primary"
                  />
                  <span className="label-text text-xs">Remember me</span>
                </label>
              </div>
              <a href="#" className="link link-primary font-semibold text-xs no-underline">
                Forgot Password?
              </a>
            </div>
            <div onClick={handleEmailLogin} className="btn btn-block btn-primary">
              Log In
            </div>
            <div className="divider text-sm">OR</div>
            <div className="w-full flex justify-center items-center gap-4">
              <button onClick={handleGoogleLogin} className="btn btn-circle dark:btn-neutral flex items-center justify-center">
                <img className="w-6" src="/icons8-google.svg" alt="Google" />
              </button>
            </div>
            <div className="text-center text-sm mt-3">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} className="text-primary font-semibold cursor-pointer hover:underline">
                Create an account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
