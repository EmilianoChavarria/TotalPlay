import { BASE_URL, token } from "../config/const";
export const AddressService = {

    saveAddress: async (address) => {
        try {
            const response = await fetch(`${BASE_URL}/address/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(address),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

}