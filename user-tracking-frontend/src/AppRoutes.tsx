import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import SubCategoryList from './components/SubCategoryList';
import ListingPage from './components/ListingPage';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import JoinPage from './pages/JoinPage';
import InvitesPage from './pages/InvitesPage';
import { useAuthContext } from './context/AuthContext';

const AppRoutes = () => {
  const { isAuthenticated, isAdminAuthenticated } = useAuthContext();

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
        path="/dashboard/login"
        element={isAdminAuthenticated ? <Navigate to="/dashboard" /> : <AdminLogin />}
      />
      <Route
        path="/dashboard/join"
        element={isAdminAuthenticated ? <Navigate to="/dashboard" /> : <JoinPage />}
      />
      <Route
        path="/dashboard/invites"
        element={isAdminAuthenticated ? <InvitesPage /> : <Navigate to="/dashboard/login" />}
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? '/home' : isAdminAuthenticated ? '/dashboard' : '/login'} />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
