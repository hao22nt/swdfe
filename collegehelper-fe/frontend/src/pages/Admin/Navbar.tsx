import React from 'react';
import { FaBookReader } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { HiBars3CenterLeft } from 'react-icons/hi2';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import ChangeThemes from '../../components/ChangesThemes';
import { menu } from '../../components/menu/data';
import MenuItem from '../../components/menu/MenuItem';

const Navbar = () => {
  const [isFullScreen, setIsFullScreen] = React.useState(true);
  const element = document.getElementById('root');

  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isFullScreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } else {
      element
        ?.requestFullscreen({ navigationUI: 'auto' })
        .catch((err) => console.error('Failed to enter fullscreen:', err));
    }
  }, [isFullScreen]);

  return (
    // Thanh ngang cố định trên cùng, đổi sang màu xanh đậm + chữ trắng
    <div className="fixed z-[3] top-0 left-0 right-0 bg-blue-700 text-white w-full flex justify-between px-3 xl:px-4 py-3 xl:py-5 gap-4 xl:gap-0">
      {/* Container Left */}
      <div className="flex gap-3 items-center">
        {/* Drawer cho mobile */}
        <div className="drawer w-auto p-0 mr-1 xl:hidden">
          <input
            id="drawer-navbar-mobile"
            type="checkbox"
            className="drawer-toggle"
            checked={isDrawerOpen}
            onChange={toggleDrawer}
          />
          <div className="p-0 w-auto drawer-content">
            <label
              htmlFor="drawer-navbar-mobile"
              className="p-0 btn btn-ghost drawer-button hover:bg-blue-800"
            >
              <HiBars3CenterLeft className="text-2xl" />
            </label>
          </div>

          {/* Sidebar Drawer */}
          <div className="drawer-side z-[99]">
            <label
              htmlFor="drawer-navbar-mobile"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            {/* Đổi sang bg-blue-900 + text-white */}
            <div className="menu p-4 w-auto min-h-full bg-blue-900 text-white">
              <Link to={'/'} className="flex items-center gap-1 xl:gap-2 mt-1 mb-5">
                <FaBookReader className="text-3xl sm:text-4xl xl:text-4xl 2xl:text-6xl text-yellow-300" />
                <span className="text-[16px] leading-[1.2] sm:text-lg xl:text-xl 2xl:text-2xl font-semibold">
                  Admissions management
                </span>
              </Link>
              {menu.map((item, index) => (
                <MenuItem
                  onClick={toggleDrawer}
                  key={index}
                  catalog={item.catalog}
                  listItems={item.listItems}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Logo bên trái (dành cho desktop) */}
        <Link to={'/'} className="flex items-center gap-1 xl:gap-2">
          {/* Đổi icon sang màu vàng cho nổi bật */}
          <FaBookReader className="text-3xl sm:text-4xl xl:text-4xl 2xl:text-6xl text-yellow-300" />
          <span className="text-[16px] leading-[1.2] sm:text-lg xl:text-xl 2xl:text-2xl font-semibold">
            Admissions management
          </span>
        </Link>
      </div>

      {/* Container Right */}
      <div className="flex items-center gap-0 xl:gap-1 2xl:gap-2 3xl:gap-5">
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullScreen}
          className="hidden xl:inline-flex btn btn-circle btn-ghost hover:bg-blue-800"
        >
          {isFullScreen ? (
            <RxEnterFullScreen className="xl:text-xl 2xl:text-2xl 3xl:text-3xl" />
          ) : (
            <RxExitFullScreen className="xl:text-xl 2xl:text-2xl 3xl:text-3xl" />
          )}
        </button>

        {/* Theme Switch
        <div className="px-0 xl:px-auto btn btn-circle btn-ghost xl:mr-1 hover:bg-blue-800">
          <ChangeThemes />
        </div> */}

        {/* Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar hover:bg-blue-800"
          >
            <div className="w-9 rounded-full">
              <img
                src="https://avatars.githubusercontent.com/u/74099030?v=4"
                alt="foto-cowok-ganteng"
              />
            </div>
          </div>
          {/* Đổi background dropdown thành bg-blue-50 để hợp tông */}
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-blue-50 text-gray-800 rounded-box w-40"
          >
            <li onClick={() => navigate('/login')}>
              <a>Log Out</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
