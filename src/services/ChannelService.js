import { BASE_URL, token } from "../config/const";

export const ChannelService = {
    saveChannel: async (channel) => {
        try {
            const response = await fetch(`${BASE_URL}/channel/saveImg`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: channel
            });
            return await response.json();
        } catch (error) {
            return error;
        }
    },


    getAllChannels: async () => {
        try {
            const response = await fetch(`${BASE_URL}/channel/`, {
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

    deleteChannel: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/channel/delete/${id}`, {
                method: "DELETE",
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
};
