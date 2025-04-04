import { BASE_URL } from "../config/const";

const token = localStorage.getItem('token');
export const ChannelService = {


    saveChannel: async (channel) => {
        console.log(channel);
        try {
            const response = await fetch(`${BASE_URL}/channel/saveImg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: channel.name,
                    description: channel.description,
                    categoryId: channel.categoryId,
                    image: channel.image
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }

}
