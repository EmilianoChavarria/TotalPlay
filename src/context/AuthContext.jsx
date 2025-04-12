import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Estado de carga

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
        setLoading(false); // Finaliza la carga
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

    // Si está cargando, muestra un loader o null
    if (loading) {
        return null; // O un componente de carga <Spinner />
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);