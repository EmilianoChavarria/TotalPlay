import React, { useState, useEffect } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { ChannelModal } from './ChannelModal';
import { ChannelService } from '../../../../services/ChannelService';
import { CategoryService } from '../../../../services/CategoryService';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '../../../CustomAlerts';

export const Channels = () => {

  const [visible, setVisible] = useState(false);
  const [channelToEdit, setChannelToEdit] = useState(null);


  const [channels, setChannels] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCity, setSelectedCity] = useState(null);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {

    try {
      const response = await CategoryService.getCategories();
      if (response.data && Array.isArray(response.data)) {
        setCategories([{ name: 'Todas' }, ...response.data]);
      } else {
        console.error("Formato de datos inesperado:", response);
        setCategories([{ name: 'Todas' }]);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setCategories([{ name: 'Todas' }]);
    }
  };

  const filteredChannels = channels.filter(channel => {
    const matchesCategory =
      !selectedCity || selectedCity.name === 'Todas' || channel.category.name === selectedCity.name;

    const matchesSearch =
      channel.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });




  const fetchChannels = async () => {

    try {
      const response = await ChannelService.getAllChannels();
      console.log(response)
      if (response.data && Array.isArray(response.data)) {
        setChannels(response.data);
      } else {
        console.error("Formato de datos inesperado:", response);
        setChannels([]);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setChannels([]);
    }
  };

  const handleEditChannel = (channel) => {
    setChannelToEdit(channel);
    setVisible(true);
  };


  const deleteChannel = async (id) => {
    showConfirmAlert(
      '¿Estás seguro de que deseas eliminar este canal?',
      async () => {

        try {
          const response = await ChannelService.deleteChannel(id);
          console.log(response)
          if (response.status === 'OK') {
            showSuccessAlert(response.message, () => {
              fetchChannels();
            });
          } else {
            showErrorAlert(response.message || 'Ocurrió un error al eliminar el canal');
          }
        } catch (error) {
          console.error("Error al eliminar el canal:", error);
          showErrorAlert('Ocurrió un error de conexión con el servidor');
        }
      },
      () => {
        // Callback para cuando el usuario cancela
        console.log('Eliminación cancelada por el usuario');
      }
    );
  };

  // Si el modal guardó un canal, recargar los canales
  const handleChannelSaved = () => {
    fetchChannels(); // Volver a cargar los canales
  };

  useEffect(() => {
    fetchCategories();
    fetchChannels();
  }, []);




  return (
    <>
      {/* Contenedor del encabezado */}
      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <h2 className='text-2xl font font-semibold whitespace-nowrap' >Gestión de Canales</h2>
        <button className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition ' onClick={() => setVisible(true)}>
          <i className={`pi pi-plus mr-2`}
            style={{ fontSize: '1rem', verticalAlign: 'middle' }}
          />
          Agregar canal
        </button>
      </div>

      {/* Contenedor de canales */}
      <div className="bg-white p-4 rounded shadow flex flex-col gap-y-4 mt-10">
        {/* Buscador */}
        <div className='w-full flex flex-col items-center justify-start gap-x-6 gap-y-2 md:flex-row md:gap-y-0'>
          <IconField iconPosition="left" className='border border-gray-300 rounded-lg w-full md:w-[70%] '>
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar canal"
              className='w-full px-10 h-12'
            />

          </IconField>

          <div className='w-full md:w-[25%] flex items-center justify-center'>
            <i
              className={`pi pi-filter mr-2`}
              style={{ fontSize: '1.2rem' }}
            />
            <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={categories} optionLabel="name"
              placeholder="Filtrar por categoría" className="w-full border border-gray-300 md:w-14rem " checkmark={true} highlightOnSelect={false} />
          </div>
        </div>


        {/* Tabla de registros */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-[700px] w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr className='bg-gray-100 '>
                <th scope="col" className="px-6 py-3 ">Logo</th>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Descripción</th>
                <th scope="col" className="px-6 py-3">Número</th>
                <th scope="col" className="px-6 py-3 ">Categoría</th>
                <th scope="col" className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredChannels.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                filteredChannels.map((channel) => (
                  <tr key={channel.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4 ">
                      <img
                        src={`data:image/jpeg;base64,${channel.logoBean?.image}`}
                        alt={channel.name}
                        className="w-8 h-8 object-contain"
                      />
                    </td>
                    <td className="px-6 py-4">{channel.name}</td>
                    <td className="px-6 py-4">{channel.description}</td>
                    <td className="px-6 py-4">{channel.number}</td>
                    <td className="px-6 py-4 ">{channel.category.name}</td>
                    <td className="px-6 py-4 flex gap-x-2">
                      <button onClick={() => handleEditChannel(channel)}>editar</button>
                      <button onClick={() => {
                        deleteChannel(channel.id);
                      }}>eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


      </div>


      {/* Modal de form para agregar canal */}
      <ChannelModal
        visible={visible}
        setVisible={setVisible}
        onSuccess={handleChannelSaved}
        channelToEdit={channelToEdit}
      />


    </>

  );
};