import { BASE_URL } from "../config/const";

const token = localStorage.getItem('token');
export const ChannelService = {


    saveChannel: async (channel) => {
        try {
            const response = await fetch(`${BASE_URL}/channel/saveImg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(channel)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }

}
