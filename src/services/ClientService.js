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
}