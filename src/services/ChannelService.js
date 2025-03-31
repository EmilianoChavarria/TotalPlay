export const ChannelService = () => {

    const getChannels = async () => {
        const response = await fetch('http://localhost:3001/api/channels');
        const data = await response.json();
        return data;
    }

}
