export const AuthService = {
    login: async (email, password) => {
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
        sessionStorage.setItem("jwt", data.jwt); // Almacena el token
        return data;
    },

    logout: () => {
        sessionStorage.removeItem("jwt");
    },

    getRole: () => {
        const token = sessionStorage.getItem("jwt");
        if (!token) return null;

        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el token
        return payload.roles[0]; // Retorna el primer rol
    },
};
