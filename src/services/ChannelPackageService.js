import { BASE_URL, token } from "../config/const";

export const ChannelPackageService = {
    
    saveChannelPackage: async (channelPackage) => {
        try {
            const response = await fetch(`${BASE_URL}/channelPackage/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(channelPackage)
            })
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    getAllChannelPackages: async () => {
        try {
            const response = await fetch(`${BASE_URL}/channelPackage/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    updateChannelPackage: async (id, channelPackage) => {
        const data = {
            ...channelPackage,
            id: id
        }
        console.log(data);
        try {
            const response = await fetch(`${BASE_URL}/channelPackage/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)

            })
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    deleteChannelPackage: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/channelPackage/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            return await response.json();
        } catch (error) {
            return error;
        }
    },

    activeChannelPackage: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/channelPackage/active/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            return await response.json();
        } catch (error) {
            return error;
        }
    },

}