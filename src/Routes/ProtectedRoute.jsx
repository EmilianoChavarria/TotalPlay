import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { user, hasRole } = useAuth();

    if (!user) {
        // Usuario no autenticado
        return <Navigate to="/" replace />;
    }

    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
        // Usuario no tiene los roles requeridos
        return <Navigate to="/not-found" replace />;
    }

    return children;
};