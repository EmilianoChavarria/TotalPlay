import React, { useEffect, useState } from 'react';
import { ClientService } from '../../../../services/ClientService';
import { ContractService } from '../../../../services/ContractService'; // Asegúrate de importar el servicio
import { ClientModal } from './clients/ClientModal';
import { Menu } from 'primereact/menu';
import { AddressManageModals } from './clients/AddressManageModal';
import { AddressModal } from './clients/AddressModal';
import { ContractModal } from './ContractModal';
import { Button } from 'primereact/button';

export const Contracts = () => {
  const [expandedClient, setExpandedClient] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleD, setVisibleD] = useState(false);
  const [visibleG, setVisibleG] = useState(false);
  const [visibleContract, setVisibleContract] = useState(false);
  const [clientContracts, setClientContracts] = useState({}); // Almacenará contratos por cliente
  const [loadingContracts, setLoadingContracts] = useState({}); // Estado de carga por cliente

  const menuRef = React.useRef(null);

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [user, setUser] = useState({});

  const menuItems = [
    {
      label: 'Agregar dirección',
      icon: 'pi pi-plus-circle',
      command: () => {
        setSelectedClient(user);
        setVisibleD(true);
      }
    },
    {
      label: 'Direcciones',
      icon: 'pi pi-home',
      command: () => {
        setSelectedClient(user);
        setVisibleG(true);
      }
    },
    {
      label: 'Registrar contrato',
      icon: 'pi pi-plus',
      command: () => {
        setVisibleContract(true);
      }
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => {
        console.log('asd');
      }
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        console.log('asd');
      }
    }
  ];

  const fetchClients = async () => {
    try {
      const response = await ClientService.gteClients();
      if (response.data && Array.isArray(response.data)) {
        setClients(response.data);
      } else {
        console.error("Formato de datos inesperado:", response);
        setClients([]);
      }
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      setClients([]);
    }
  }

  const fetchContractsForClient = async (clientId) => {
    try {
      setLoadingContracts(prev => ({ ...prev, [clientId]: true }));
      const response = await ContractService.findbyClientId(clientId);
      console.log(response);
      setClientContracts(prev => ({
        ...prev,
        [clientId]: response.data || []
      }));
    } catch (error) {
      console.error(`Error al obtener contratos para el cliente ${clientId}:`, error);
      setClientContracts(prev => ({
        ...prev,
        [clientId]: []
      }));
    } finally {
      setLoadingContracts(prev => ({ ...prev, [clientId]: false }));
    }
  };

  const handleClientSave = () => {
    fetchClients();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const toggleClient = async (clientId) => {
    if (expandedClient === clientId) {
      setExpandedClient(null);
    } else {
      // Si no tenemos los contratos de este cliente, los cargamos
      if (!clientContracts[clientId]) {
        await fetchContractsForClient(clientId);
      }
      setExpandedClient(clientId);
    }
  };

  return (
    <>
      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <h2 className='text-2xl font font-semibold whitespace-nowrap'>Gestión de contratos</h2>
        <button className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition' onClick={() => setVisible(true)}>
          <i className={`pi pi-plus mr-2`}
            style={{ fontSize: '1rem', verticalAlign: 'middle' }}
          />
          Agregar cliente
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded-md shadow mt-10">
        <table className="min-w-full text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr className='text-xs text-gray-700 uppercase'>
              <th className="px-6 py-3 ">Nombre completo</th>
              <th className="px-6 py-3 ">Email</th>
              <th className="px-6 py-3 ">RFC</th>
              <th className="px-6 py-3 ">Telefono</th>
              <th className="px-6 py-3 ">Direcciones</th>
              <th className="px-6 py-3 ">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <React.Fragment key={client.id}>
                <tr
                  className="hover:bg-gray-50 cursor-pointer text-center"
                  onClick={() => toggleClient(client.id)}
                >
                  <td className="px-6 py-4 ">
                    <div className="font-medium text-gray-900">{client.name} {client.lastName} {client.surname}</div>
                  </td>
                  <td className="px-6 py-4">{client.email}</td>
                  <td className="px-6 py-4">{client.rfc}</td>
                  <td className="px-6 py-4">{client.phone}</td>
                  <td className="px-6 py-4">{client.addresses.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-white rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUser({
                          userId: client.id,
                          name: client.name,
                          lastName: client.lastName,
                          surname: client.surname,
                          email: client.email,
                          rfc: client.rfc,
                          phone: client.phone,
                        });
                        menuRef.current.toggle(e)
                      }}
                    >
                      <i
                        className={`pi pi-ellipsis-v p-2 rounded-lg text-gray-800 mx-auto`}
                        style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}
                        aria-controls="popup_menu"
                        aria-haspopup
                      />
                    </button>

                    <Menu
                      model={menuItems}
                      popup
                      ref={menuRef}
                      id="popup_menu"
                      className="text-sm"
                    />
                  </td>
                </tr>

                {expandedClient === client.id && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4">
                      <div className="space-y-4 pl-8">
                        {loadingContracts[client.id] ? (
                          <div className="flex justify-center items-center py-4">
                            <i className="pi pi-spinner pi-spin mr-2"></i>
                            Cargando contratos...
                          </div>
                        ) : clientContracts[client.id]?.length > 0 ? (
                          clientContracts[client.id].map((contract) => (
                            <div key={contract.id} className="border-l-4 border-blue-500 pl-4 py-3 shadow-sm">
                              <div className="flex justify-between items-start">
                                <div className="mt-2 text-sm text-gray-500">
                                  <p className='text-xl font-bold'>{contract.salesPackageEntity.name}</p>
                                  <p><span className="font-medium">Contratado el:</span> {contract.creationDate}</p>
                                  <p><span className="font-medium">Dirección:</span> {contract.address.name}
                                    <p>{contract.address.street}, #{contract.address.number}, {contract.address.city}, {contract.address.state}, C.P. {contract.address.zipCode}</p>
                                  </p>
                                  {/* <p><span className="font-medium">Address:</span> {contract.address}</p> */}
                                </div>
                                <div className='flex'>
                                  <div className='flex flex-col gap-y-2'>
                                    <span className={`px-2 py-1 text-xs w-fit font-semibold rounded-full ${contract.status === true
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                      }`}>
                                      {contract.status === true ? "Activo" : "Inactivo"}
                                    </span>
                                    <span className='text-xl font-bold text-blue-500'>
                                      ${contract.salesPackageEntity.totalAmount}/mes
                                    </span>
                                  </div>
                                  <div className='flex gap-x-2 items-center justify-center ml-4'>
                                    <Button tooltip="Cancelar contrato" tooltipOptions={{ position: 'bottom' }}>
                                      <i className="pi pi-times-circle text-red-500" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }} />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No se encontraron contratos para este cliente
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <ClientModal visible={visible} setVisible={setVisible} onSuccess={handleClientSave} />
      <AddressModal visibleD={visibleD} setVisibleD={setVisibleD} user={selectedClient} onSuccess={handleClientSave} />
      <AddressManageModals visibleD={visibleG} setVisibleD={setVisibleG} user={user} />
      <ContractModal user={user} visible={visibleContract} setVisible={setVisibleContract} />
    </>
  );
};