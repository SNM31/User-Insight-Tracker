// AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import SubCategoryList from './components/SubCategoryList';
import ListingPage from './components/ListingPage';
import { useAuth } from './hooks/useAuth';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
      <Route path="/category/:category" element={isAuthenticated ? <SubCategoryList /> : <Navigate to="/login" />} />
      <Route path="/category/:category/:sub" element={isAuthenticated ? <ListingPage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
