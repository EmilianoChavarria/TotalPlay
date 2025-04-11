import { BASE_URL, token } from "../config/const";

export const CategoryService = {
    

    // Traer todas las categorías
    getCategories: async () => {
        console.log(token)
        try {
            const response = await fetch(`${BASE_URL}/channelCategory/`, {
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

    // Guardar categoría
    saveCategory: async (name) => {

        try {
            const response = await fetch(`${BASE_URL}/channelCategory/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({name})
            })
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }



    }


}