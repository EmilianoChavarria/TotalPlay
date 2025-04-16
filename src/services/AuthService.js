import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';  // Importación corregida
import { BASE_URL } from '../config/const';

export const AuthService = {
    login: async (email, password) => {
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();


            if (!response.ok) {
                const errorMessage =  data.Error || "Error al enviar el correo";
                throw new Error(errorMessage);

            }


            if (data.token) {
                const decoded = jwtDecode(data.token);  
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', decoded.sub);

                if (decoded.roles) {
                    localStorage.setItem('roles', JSON.stringify(decoded.roles));
                }
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente',
                timer: 1300,
                showConfirmButton: false
            });

            return data;
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al iniciar sesión',
                confirmButtonText: 'Entendido'
            });
            throw error;
        }
    },

    logout: () => {
        // Limpiar todos los datos de autenticación
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("roles");

        // Opcional: Mostrar mensaje al cerrar sesión
        Swal.fire({
            icon: 'info',
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión correctamente',
            timer: 2000,
            showConfirmButton: false
        });
    },

    getRole: () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const decoded = jwt_decode(token); // Usamos jwt-decode en lugar de atob
            return decoded.roles ? decoded.roles[0] : null; // Retorna el primer rol si existe
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    },

    getUserId: () => {
        return localStorage.getItem("id"); // Función adicional para obtener el ID
    },

    sendEmail: async (email) => {
        console.log(JSON.stringify({ email }));
        try {
            const response = await fetch(`http://localhost:8080/auth/forward-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({ email })
            });

            const data = await response.json(); // <-- Mover esto arriba

            if (!response.ok) {
                throw new Error(data.message || "Error al enviar el correo"); 
            
            }


            // Mostrar mensaje de éxito
            await Swal.fire({
                icon: 'success',
                title: '¡Correo enviado!',
                text: 'Revisa tu bandeja de entrada para restablecer tu contraseña.',
                timer: 1300,
                showConfirmButton: false
            });

            return data;
        } catch (error) {
            // Mostrar mensaje de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al enviar el correo',
                confirmButtonText: 'Entendido'
            });
            throw error;
        }
    },

    changePassword: async (data) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${BASE_URL}/user/forward-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                },
                body: new URLSearchParams({
                    userId: data.userId,
                    password: data.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cambiar la contraseña');
            }

            return await response.json();
        } catch (error) {
            console.error("Error en changePassword:", error);
            throw error;
        }
    }
};