import { BASE_URL } from "../config/const";

export const ReportsService = {
  getTotalUsers: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/client/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const response = await res.json();
      return response.data?.length || 0;
    } catch (error) {
      console.error("Error in getTotalUsers:", error);
      return 0;
    }
  },

  getTotalContracts: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/contract/contracts/with-total`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const response = await res.json();
      return response.data?.length || 0;
    } catch (error) {
      console.error("Error in getTotalContracts:", error);
      return 0;
    }
  },

  getTotalSales: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/contract/contracts/with-total`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const response = await res.json();
      return response.data?.reduce((sum, contract) => sum + (contract.totalAmount || 0), 0) || 0;
    } catch (error) {
      console.error("Error in getTotalSales:", error);
      return 0;
    }
  },

  getMonthlyContracts: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/contract/contracts/with-total`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const response = await res.json();
      const contractsByMonth = Array(12).fill(0);
      
      response.data?.forEach(contract => {
        try {
          const date = new Date(contract.creationDate);
          const month = date.getMonth();
          contractsByMonth[month]++;
        } catch (e) {
          console.error("Error processing contract date:", e);
        }
      });
      
      return contractsByMonth;
    } catch (error) {
      console.error("Error in getMonthlyContracts:", error);
      return Array(12).fill(0);
    }
  },


};