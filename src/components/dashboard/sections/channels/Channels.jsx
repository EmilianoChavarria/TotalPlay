import React, { useState } from 'react';

export const Channels = () => {
  const [channels, setChannels] = useState([
    {
      id: 1,
      logo: "https://placehold.co/50x50",
      name: "Channel 1",
      category: "Category 1",
      price: "$2999"
    },
    {
      id: 2,
      logo: "https://placehold.co/50x50",
      name: "Channel 2",
      category: "Category 2",
      price: "$1999"
    },
    {
      id: 3,
      logo: "https://placehold.co/50x50",
      name: "Channel 3",
      category: "Category 3",
      price: "$99"
    },
    {
      id: 4,
      logo: "https://placehold.co/50x50",
      name: "Channel 4",
      category: "Category 4",
      price: "$799"
    },
    {
      id: 5,
      logo: "https://placehold.co/50x50",
      name: "Channel 5",
      category: "Category 5",
      price: "$999"
    }
  ]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Logo</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Categoría</th>
              <th scope="col" className="px-6 py-3">Precio</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  <img src={channel.logo} alt={channel.name} className="w-8 h-8 object-contain" />
                </td>
                <td className="px-6 py-4">{channel.name}</td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">{channel.category}</td>
                <td className="px-6 py-4">{channel.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
