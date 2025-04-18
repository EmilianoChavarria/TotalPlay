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

    updateChannel: async (id, formData) => {
        try {
            
            formData.append('id', id.toString());
    
            const response = await fetch(`${BASE_URL}/channel/updateImg`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    
                },
                body: formData 
            });
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error en updateChannel:", error);
            throw error; 
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

           
            return response;
        } catch (error) {
            return error;
        }
    },

    activatechannel: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/channel/active/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

           
            return response;
        } catch (error) {
            return error;
        }
    },
};
