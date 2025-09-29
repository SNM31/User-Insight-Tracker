import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAdminAuth } from './hooks/useAdminAuth';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import SubCategoryList from './components/SubCategoryList';
import ListingPage from './components/ListingPage';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const {isAdminAuthenticated} = useAdminAuth();

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
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
      />
      <Route
        path="/login/admin"
        element={isAdminAuthenticated ? <Navigate to="/login" /> : <AdminLogin />  }
      />
       <Route path="/register/admin" element={<AdminRegister />} />
    </Routes>
  );
};

export default AppRoutes;
