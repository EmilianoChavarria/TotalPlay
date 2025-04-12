import { BASE_URL, token } from "../config/const";

export const SalesPackageService = {
    saveChannel: async (salesPackage) => {
        console.log(
            JSON.stringify(salesPackage)
        )
        try {
            const response = await fetch(`${BASE_URL}/salesPackage/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(salesPackage)
            });
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    getAllSalesPackage: async () => {
        try {
            const response = await fetch(`${BASE_URL}/salesPackage/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    deleteSalesPackage: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/salesPackage/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            return error;
        }
    },
    

}