import React, { useEffect, useState } from "react";
import { ReportsService } from '../../../../services/ReportsServices';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];


const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
};

export const Reports = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalContracts, setTotalContracts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [contractData, setContractData] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [users, contracts, sales, monthlyData] = await Promise.all([
          ReportsService.getTotalUsers(token),
          ReportsService.getTotalContracts(token),
          ReportsService.getTotalSales(token),
          ReportsService.getMonthlyContracts(token)
        ]);

        console.log("Datos recibidos:", { users, contracts, sales, monthlyData });

        setTotalUsers(users);
        setTotalContracts(contracts);
        setTotalSales(sales);
        setContractData(monthlyData);
      } catch (error) {
        console.error("Error al cargar métricas:", error);
        setError("Error al cargar los datos. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const lineChartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Contratos registrados",
        data: contractData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto w-full mt-6 p-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
  <div className="card bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded-xl h-28 border border-gray-200 dark:border-gray-600 shadow-sm">
    <p className="font-semibold text-gray-700 dark:text-white">Total de clientes</p>
    <h2 className="font-bold text-[23px] text-gray-900 dark:text-white">{totalUsers}</h2>
  </div>

  <div className="card bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded-xl h-28 border border-gray-200 dark:border-gray-600 shadow-sm">
    <p className="font-semibold text-gray-700 dark:text-white">Total Contratos</p>
    <h2 className="font-bold text-[23px] text-blue-500">{totalContracts}</h2>
  </div>

  <div className="card bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded-xl h-28 border border-gray-200 dark:border-gray-600 shadow-sm">
    <p className="font-semibold text-gray-700 dark:text-white">Total Ventas</p>
    <h2 className="font-bold text-[23px] text-blue-500">${totalSales.toFixed(2)}</h2>
  </div>
</div>

      <div className="h-98 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800 p-6">
        <div className="flex flex-col items-start mb-4">
          <p className="font-semibold text-2xl text-gray-800 dark:text-white">Crecimiento de ventas</p>
          <p className="text-gray-500 dark:text-gray-400">Evolución mensual durante el último año</p>
        </div>

        <div className="w-full h-70 bg-white dark:bg-gray-700 rounded p-6">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

    </div>
  );
};