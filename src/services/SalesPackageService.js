import { BASE_URL, token } from "../config/const";

export const SalesPackageService = {
    saveChannel: async (salesPackage) => {
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
    

}