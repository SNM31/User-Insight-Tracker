import { Routes, Route, Navigate } from 'react-router-dom';
import { isTokenValid } from './utils/tokenUtils';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import SubCategoryList from './components/SubCategoryList';
import ListingPage from './components/ListingPage';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import JoinPage from './pages/JoinPage';

const AppRoutes = () => {
  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  const isAuthenticated = Boolean(userToken && isTokenValid(userToken));
  const isAdminAuthenticated = Boolean(adminToken && isTokenValid(adminToken));

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/category/:category"
        element={isAuthenticated ? <SubCategoryList /> : <Navigate to="/login" />}
      />
      <Route
        path="/category/:category/:sub"
        element={isAuthenticated ? <ListingPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAdminAuthenticated ? <Dashboard /> : <Navigate to="/dashboard/login" />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : isAdminAuthenticated ? "/dashboard" : "/login"} />}
      />
      <Route
        path="/dashboard/login"
        element={isAdminAuthenticated ? <Navigate to="/dashboard" /> : <AdminLogin />}
      />
      <Route
        path="/dashboard/join"
        element={isAdminAuthenticated ? <Navigate to="/dashboard" /> : <JoinPage />}
      />
    </Routes>
  );
};

export default AppRoutes;
