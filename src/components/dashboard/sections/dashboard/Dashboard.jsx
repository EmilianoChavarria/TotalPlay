import React, { useState, useEffect } from 'react';
import { DashboardCard } from '../../../cards/DashboardCard'
import { useAuth } from '../../../../context/AuthContext';
import { ContractService } from '../../../../services/ContractService';
import { StatsService } from '../../../../services/StatsService';

export const Dashboard = () => {
  const { hasRole } = useAuth();
  const [countPackages, setCountPackages] = useState(0);
  const [countContracts, setCountContracts] = useState(0);
  const [countClients, setCountClients] = useState(0);
  const [countChannels, setCountChannels] = useState(0);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const getStats = async () => {
    try {
      const response = await StatsService.countPackages();
      const response1 = await StatsService.countClients();
      const response2 = await StatsService.countContracts();
      const response3 = await StatsService.countChannels();

      console.log("Count de paquetes", response);
      console.log("Count de clientes", response1);
      console.log("Count de contratos", response2);
      console.log("Count de canales", response3);
      setCountPackages(response.data);
      setCountClients(response1.data);
      setCountContracts(response2.data);
      setCountChannels(response3.data);
    } catch (error) {
      console.error("Error al obtener contratos:", error);
    } finally {
      setLoading(false);
    }
  }

  const getContractsByAgent = async () => {
    try {
      const agentId = localStorage.getItem("id");
      if (agentId) {
        const response = await ContractService.findAllByAgent(agentId);
        console.log("Contratos del agente:", response);
        setContracts(response.data);
      } else {
        console.error("No se encontró el ID del agente en localStorage");
      }
    } catch (error) {
      console.error("Error al obtener contratos:", error);
    } finally {
      setLoading(false);
    }
  }

  const renderContractsContent = () => {
    if (loading) {
      return <p>Cargando contratos...</p>;
    }

    if (contracts.length === 0) {
      return <>
        <div className="col-span-full mt-6">
          <div className="flex items-center justify-center text-gray-500 text-sm font-medium px-4 py-3 ">
            <i className="pi pi-info-circle mr-2" style={{ fontSize: '1rem', color: "grey" }} />
            No hay contratos disponibles.
          </div>
        </div>
      </>;
    }

    return (
      <div className="overflow-x-auto w-full mt-6 p-4">
        <table className="min-w-[700px] w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr className='bg-gray-100'>
              <th scope="col" className="hidden px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Servicio</th>
              <th scope="col" className="px-6 py-3">Precio</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Fecha Inicio</th>
            </tr>
          </thead>
          <tbody>
            {renderContractsRows()}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContractsRows = () => {
    if (contracts.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-500">
            No se encontraron contratos.
          </td>
        </tr>
      );
    }

    return contracts
      .sort((a, b) => (b.status === true) - (a.status === true))
      .filter((contract) => mostrarInactivos || contract.status === true)
      .map((contract) => (
        <tr key={contract.id} className="border-b border-gray-200 dark:border-gray-700">
          <td className="hidden px-6 py-3">{contract.id}</td>
          <td className="px-6 py-4">{contract.salesPackageEntity?.name || 'N/A'}</td>
          <td className="px-6 py-4">${contract.salesPackageEntity?.totalAmount || 'N/A'}/mes</td>
          <td className="px-6 py-4">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contract.status === true
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}>
              {contract.status === true ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          <td className="px-6 py-4">
            {contract.creationDate ? new Date(contract.creationDate).toLocaleDateString() : 'N/A'}
          </td>
        </tr>
      ));






  };

  useEffect(() => {
    getStats();
    getContractsByAgent();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <section className='flex flex-col gap-y-2 md:flex-row md:justify-start md:items-center md:gap-x-8'>
        <div className='w-full md:w-[23%]'>
          <DashboardCard name='Paquetes' quantity={countPackages} icon='pi pi-box' />
        </div>
        <div className='w-full md:w-[23%]'>
          <DashboardCard name='Contratos activos' quantity={countContracts} icon='pi pi-file' />
        </div>
        {hasRole('ADMIN') && (
          <div className='w-full md:w-[23%]'>
            <DashboardCard name='Total de canales' quantity={countChannels} icon='pi pi-desktop' />
          </div>
        )}
        <div className='w-full md:w-[23%]'>
          <DashboardCard name='Clientes' quantity={countClients} icon='pi pi-box' />
        </div>
      </section>

      <section className="bg-white mt-6 p-4 rounded-lg">

        {countClients > 0 && (
          <div>

            <h2 className="text-xl font-semibold mb-4">Mis contratos vendidos</h2>
            <button
              onClick={() => setMostrarInactivos(!mostrarInactivos)}
              className="mb-4 ml-5 text-blue-600 text-sm font-medium"
            >
              {mostrarInactivos ? 'Ocultar inactivos ' : 'Mostrar inactivos '}
            </button>
          </div>

        )}


        {renderContractsContent()}
      </section>
    </div>
  );

}