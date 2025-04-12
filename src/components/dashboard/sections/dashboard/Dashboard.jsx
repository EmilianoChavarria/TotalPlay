import React, { useEffect, useState } from 'react'
import { DashboardCard } from '../../../cards/DashboardCard'
import { useAuth } from '../../../../context/AuthContext';
import { ContractService } from '../../../../services/ContractService';

export const Dashboard = () => {
  const { hasRole } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getContractsByAgent = async () => {
    try {
      const agentId = localStorage.getItem("id");
      if (agentId) {
        const response = await ContractService.findByAgent(agentId);
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

  useEffect(() => {
    getContractsByAgent();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <section className='flex flex-col gap-y-2 md:flex-row md:justify-start md:items-center md:gap-x-8'>
        <div className='w-full md:w-[23%]'>
          <DashboardCard name='Paquetes' quantity={10} icon='pi pi-box' />
        </div>
        <div className='w-full md:w-[23%]'>
          <DashboardCard name='Contratos activos' quantity={contracts.length} icon='pi pi-file' />
        </div>
        {hasRole('ADMIN') && (
          <div className='w-full md:w-[23%]'>
            <DashboardCard name='Total de canales' quantity={10} icon='pi pi-desktop' />
          </div>
        )}
        <div className='w-full md:w-[23%]'>
          <DashboardCard name='Clientes' quantity={10} icon='pi pi-box' />
        </div>
      </section>

      <section className="bg-white mt-6 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Mis contratos vendidos</h2>
        {loading ? (
          <p>Cargando contratos...</p>
        ) : contracts.length > 0 ? (
          <div className="overflow-x-auto w-full mt-6 p-4">
            <table className="min-w-[700px] w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                <tr className='bg-gray-100'>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Servicio</th>
                  <th scope="col" className="px-6 py-3">Precio</th>
                  <th scope="col" className="px-6 py-3">Estado</th>
                  <th scope="col" className="px-6 py-3">Fecha Inicio</th>
                </tr>
              </thead>
              <tbody>
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No se encontraron contratos.
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-6 py-4">{contract.id}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No se encontraron contratos.</p>
        )}
      </section>
    </div>
  );
}