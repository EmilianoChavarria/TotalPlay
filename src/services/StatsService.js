import { BASE_URL, token } from "../config/const";

export const StatsService = {
    countPackages: async () => {
        try {
            const response = await fetch(`${BASE_URL}/salesPackage/salesPackageCount/`, {
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
    countClients: async () => {
        try {
            const response = await fetch(`${BASE_URL}/client/clientCount/`, {
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
    countContracts: async () => {
        try {
            const response = await fetch(`${BASE_URL}/contract/contractsCount/`, {
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
    countChannels: async () => {
        try {
            const response = await fetch(`${BASE_URL}/channel/channelCount/`, {
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
}