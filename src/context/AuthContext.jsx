import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            localStorage.setItem('id', decoded.sub);
            return {
                roles: decoded.roles || [],
                email: decoded.sub || '',
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    // Verificar el token al iniciar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = decodeToken(token);
            if (userData) {
                setUser(userData);
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const userData = decodeToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const hasRole = (requiredRole) => {
        return user?.roles.includes(requiredRole);
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        hasRole
    }), [user]); // Only recreate when user changes

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);