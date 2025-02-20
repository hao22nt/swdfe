import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const navigate = useNavigate();
  const auth = getAuth();

  // Theo dõi trạng thái đăng nhập của user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  // Xử lý logout
  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-10 xl:gap-8">
        {/* Block 1 */}
        <div className="flex items-start justify-between">
          <h2 className="font-bold text-2xl xl:text-4xl text-base-content dark:text-neutral-200">
            My Profile
          </h2>
          <button
            onClick={() => navigate("/profile/edit")}
            className="btn text-xs xl:text-sm dark:btn-neutral"
          >
            
          </button>
        </div>

        {/* Block 2 */}
        <div className="flex items-center gap-3 xl:gap-8 xl:mb-4">
          <div className="avatar">
            <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
              <img
                src={user?.photoURL || "https://via.placeholder.com/150"}
                alt="User Avatar"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">
              {user?.displayName || "Guest User"}
            </h3>
            <span className="font-normal text-base">User</span>
          </div>
        </div>

        {/* Block 3 */}
        <div className="w-full flex flex-col items-stretch gap-3 xl:gap-7">
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl">Basic Information</h4>
            <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
          </div>

          {/* User Info Grid */}
          <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-5 xl:text-base">
            <div className="w-full flex flex-col gap-5">
              <span>Email:</span>
              <span className="font-semibold">{user?.email || "No email provided"}</span>
            </div>
          </div>
        </div>

        {/* Logout & Delete Account */}
        <div className="w-full flex justify-start items-center mt-10">
          <button
            className="btn dark:btn-neutral text-error dark:text-error text-xs xl:text-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
