import React, { useState } from 'react';

export const Contracts = () => {
  const [expandedClient, setExpandedClient] = useState(null);

  // Datos de ejemplo (puedes reemplazar con datos reales de tu API)
  const clients = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      totalContracts: 2,
      contracts: [
        {
          id: 101,
          name: "Premium Bundle",
          status: "ACTIVE",
          price: "$99.99/month",
          started: "2023-01-01",
          address: "123 Main St. City"
        },
        {
          id: 102,
          name: "Basic Internet",
          status: "CANCELLED",
          price: "$49.99/month",
          started: "2022-06-15",
          address: "123 Main St. City"
        }
      ]
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      totalContracts: 1,
      contracts: [
        {
          id: 201,
          name: "Basic Internet",
          status: "ACTIVE",
          price: "$49.99/month",
          started: "2022-05-10",
          address: "456 Oak Ave. Town"
        }
      ]
    }
  ];

  const toggleClient = (clientId) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Client Contracts</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Contracts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <React.Fragment key={client.id}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleClient(client.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.totalContracts}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Lógica para añadir contrato
                        console.log('Add contract for', client.name);
                      }}
                    >
                      + Add Contract
                    </button>
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
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                contract.status === "ACTIVE" 
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
    </div>
  );
};