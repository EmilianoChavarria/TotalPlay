import React, { useEffect, useState } from 'react';
import { ClientService } from '../../../../services/ClientService';
import { ClientModal } from './clients/ClientModal';
import { Menu } from 'primereact/menu';
import { AddressManageModals } from './clients/AddressManageModal';
import { AddressModal } from './clients/AddressModal';
import { ContractModal } from './ContractModal';

export const Contracts = () => {
  const [expandedClient, setExpandedClient] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleD, setVisibleD] = useState(false);
  const [visibleG, setVisibleG] = useState(false);
  const [visibleContract, setVisibleContract] = useState(false);


  const menuRef = React.useRef(null);


  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);


  const [user, setUser] = useState({});

  const menuItems = [
    {
      label: 'Agregar dirección',
      icon: 'pi pi-plus-circle',
      command: () => {
        // Aquí iría la lógica para editar
        setSelectedClient(user);
        setVisibleD(true);
      }
    },
    {
      label: 'Direcciones',
      icon: 'pi pi-home',
      command: () => {
        // Aquí iría la lógica para editar
        setSelectedClient(user);
        setVisibleG(true);
      }
    },
    {
      label: 'Registrar contrato',
      icon: 'pi pi-plus',
      command: () => {
        // Aquí iría la lógica para editar
        setVisibleContract(true);
      }
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => {
        // Aquí iría la lógica para editar
        console.log('asd');
      }
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        // Aquí iría la lógica para eliminar
        console.log('asd');
      }
    }
  ];

  const fetchClients = async () => {
    try {
      const response = await ClientService.gteClients();
      console.log(response)
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


  const handleClientSave = () => {
    fetchClients(); // Volver a cargar los canales
  };


  useEffect(() => {
    fetchClients();
  }, []);

  const toggleClient = (clientId) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  return (
    <>
      {/* Contenedor del encabezado */}
      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <h2 className='text-2xl font font-semibold whitespace-nowrap' >Gestión de contratos</h2>
        <button className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition ' onClick={() => setVisible(true)}>
          <i className={`pi pi-plus mr-2`}
            style={{ fontSize: '1rem', verticalAlign: 'middle' }}
          />
          Agregar cliente
        </button>
      </div>

      {/* Contenido */}
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
                      className="  text-white rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Lógica para añadir contrato
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
                        className={`pi pi-ellipsis-v p-2 rounded-lg text-gray-800 mx-auto `}
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
                    <td colSpan="5" className="px-6 py-4">
                      <div className="space-y-4 pl-8">
                        {client.contracts.map((contract) => (
                          <div key={contract.id} className="border-l-4 border-blue-500 pl-4 py-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{contract.name}</h3>
                                <p className="text-gray-600">{contract.price}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contract.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}>
                                {contract.status}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              <p><span className="font-medium">Started:</span> {contract.started}</p>
                              <p><span className="font-medium">Address:</span> {contract.address}</p>
                            </div>
                          </div>
                        ))}
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