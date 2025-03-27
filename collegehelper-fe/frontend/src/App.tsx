// import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  
  Navigate,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Admin/Home';
import Users from './pages/Users';
import Admission from './pages/Admin/Admission';
import Navbar from './pages/Admin/Navbar';
import Footer from './components/Footer';
import Menu from './components/menu/Menu';
import Error from './pages/Error';
import Profile from './pages/Admin/Profile';
import Major from './pages/Admin/Major';
import Posts from './pages/Admin/Posts';
import Charts from './pages/Admin/Charts';
import Logs from './pages/Logs';
import ToasterProvider from './components/ToasterProvider';
import EditProfile from './pages/Admin/EditProfile';
import User from './pages/User';
import Login from './pages/Login';
import Register from './pages/Register';
import University from './pages/Admin/University';
import UserLayout from './pages/User/UserLayout';
import AdmissionPage from './pages/User/admission';
import WishlistPage from './pages/User/wishlist';
import Homepage from './pages/User/Homepage';
import UserProfile from './pages/User/profile/index';
import Subject from './pages/Admin/Subject';
import Chatbot from './pages/User/ChatPopup';
import ScoreInput from './pages/User/scores';
import AdmissionsPage1 from './pages/Admin/Admissionin4';
// Sửa lại component bảo vệ route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();
  const isUserPath = location.pathname.startsWith('/user');
  
  // Nếu chưa đăng nhập, chuyển về trang login
  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/login" replace />;
  }

  // Admin có thể truy cập mọi route
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // User thường chỉ được vào /user routes
  if (userRole === 'user' && !isUserPath) {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
};

function App() {
  const Layout = () => {
    const location = useLocation();
    const isUserPage = location.pathname === '/user' || location.pathname.startsWith('/user/');

    return (
      <div className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between">
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
            <Chatbot /> 
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
          path: '/users',
          element: <Users />,
        },
        {
          path: '/users/:id',
          element: <User />,
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
          path: '/admission',
          element: <Admission />,
        },
        {
          path: '/admissionin4',
          element: <AdmissionsPage1 />,
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
          path: '/subjects',
          element: <Subject />,
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
              path: 'homepage',
              element: <Homepage />,
            },
            {
              path: 'profile',
              element: <UserProfile />,
            },
            {
              path: 'admission',
              element: <AdmissionPage />,
            },
            {
              path: 'wishlist',
              element: <WishlistPage />,
            },
            {
              path: 'scores',
              element: <ScoreInput />,
            },
            
            {
              index: true,
              element: <Navigate to="homepage" replace />,
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
