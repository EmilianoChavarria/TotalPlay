// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;