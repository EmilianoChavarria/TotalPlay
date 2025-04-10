import Swal from 'sweetalert2';

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

            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }

            const data = await response.json();
            
            // Mostrar mensaje de éxito
            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente',
                timer: 1300,
                showConfirmButton: false
            });
            
            return data;
        } catch (error) {
            // Mostrar mensaje de error
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
        sessionStorage.removeItem("jwt");
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

        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el token
        return payload.roles[0]; // Retorna el primer rol
    },
};