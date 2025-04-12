import { BASE_URL, token } from "../config/const";

export const ContractService = {
    saveContract: async (contract) => {
        const response = await fetch(`${BASE_URL}/contract/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}}`
            },
            body: JSON.stringify(contract)
        });

        if (!response.ok) {
            throw new Error('Error saving contract');
        }

        return await response.json();
    },

    findbyClientId: async (clientId) => {
        const response = await fetch(`${BASE_URL}/contract/findByClient/${clientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching contracts');
        }

        return await response.json();
    },
}