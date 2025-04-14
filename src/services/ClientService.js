import { BASE_URL, token } from "../config/const";

export const ClientService = {
    gteClients: async () => {
        try {
            const response = await fetch(`${BASE_URL}/client/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    saveClient: async (client) => {
        try {
            const response = await fetch(`${BASE_URL}/client/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(client),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    updateClient: async (client) => {
        console.log(
            "client en updateClient: ", client
        )
        try {
            const response = await fetch(`${BASE_URL}/client/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(client),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    saveAgente: async (agent) => {
        try {
            const response = await fetch(`http://localhost:8080/auth/registerAgente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(agent),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    deleteUser: async (agentId) => {
        try {
            const response = await fetch(`${BASE_URL}/user/deleteAgente/${agentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    editAgente: async (agent) => {
        try {
            const response = await fetch(`${BASE_URL}/user/UpdateAgente`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(agent),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    findAllUsers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/find-all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }

    }
}