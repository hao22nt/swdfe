// import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  
  Navigate,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Admission from './pages/Admission';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Menu from './components/menu/Menu';
import Error from './pages/Error';
import Profile from './pages/Profile';
import Major from './pages/Major';
import Posts from './pages/Posts';
//import Notes from './pages/Notes';
//import Calendar from './pages/Calendar';
import Charts from './pages/Charts';
import Logs from './pages/Logs';
import ToasterProvider from './components/ToasterProvider';
import EditProfile from './pages/EditProfile';
import User from './pages/User';
import Login from './pages/Login';
import Register from './pages/Register';
import University from './pages/University';
import UserLayout from './userpages/UserLayout';
import AdmissionPage from './userpages/admission';
import WishlistPage from './userpages/wishlist';
import NewsPage from './userpages/news';

// Sửa lại component bảo vệ route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isGoogleUser = localStorage.getItem('isGoogleUser') === 'true';
  const location = useLocation();
  const isUserPath = location.pathname.startsWith('/user'); // /user routes
  const isUsersPath = location.pathname.startsWith('/users'); // /users routes
  
  // Nếu là Google user và cố truy cập route không phải /user
  if (isGoogleUser && !isUserPath) {
    return <Navigate to="/user" replace />;
  }

  // Nếu là admin (không phải Google user) và cố truy cập route /user (không phải /users)
  if (!isGoogleUser && isUserPath && !isUsersPath) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const Layout = () => {
    const location = useLocation();
    const isUserPage = location.pathname === '/user' || location.pathname.startsWith('/user/');

    return (
      <div
        id="rootContainer"
        className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
      >
        <ToasterProvider />
        <ScrollRestoration />
        <div>
          <Navbar />
          <div className="w-full flex gap-0 pt-20 xl:pt-[96px] 2xl:pt-[112px] mb-auto">
            {!isUserPage && (
              <div className="hidden xl:block xl:w-[250px] 2xl:w-[280px] 3xl:w-[350px] border-r-2 border-base-300 dark:border-slate-700 px-3 xl:px-4 xl:py-1">
                <Menu />
              </div>
            )}
            <div className="w-full px-4 xl:px-4 2xl:px-5 xl:py-2 overflow-clip">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
        {
          path: '/profile/edit',
          element: <EditProfile />,
        },
        {
          path: '/users',
          element: <Users />,
        },
        {
          path: '/users/:id',
          element: <User />,
        },
        {
          path: '/admission',
          element: <Admission />,
        },
        {
          path: '/admission/:id',
          element: <Admission />,
        },
        {
          path: '/major',
          element: <Major />,
        },
        {
          path: '/posts',
          element: <Posts />,
        },
        {
          path: '/charts',
          element: <Charts />,
        },
        {
          path: '/logs',
          element: <Logs />,
        },
        {
          path: '/university',
          element: <University />,
        },
        {
          path: '/user',
          element: <UserLayout />,
          children: [
            {
              path: 'admission',
              element: <AdmissionPage />,
            },
            {
              path: 'wishlist',
              element: <WishlistPage />,
            },
            {
              path: 'news',
              element: <NewsPage />,
            },
            {
              index: true,
              element: <Navigate to="admission" replace />,
            },
          ],
        },
      ],
      errorElement: <Error />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
