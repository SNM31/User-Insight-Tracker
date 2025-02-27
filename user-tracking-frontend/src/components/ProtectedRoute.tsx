import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}; 