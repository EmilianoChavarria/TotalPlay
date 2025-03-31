import React, { useState } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";



// Esto es para el formulario
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ChannelModal } from './ChannelModal';

export const Channels = () => {

  const [visible, setVisible] = useState(false);
  






  const [channels, setChannels] = useState([
    {
      id: 1,
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Discovery_Kids_Logo_2021-Presente.webp",
      name: "Discovery Kids",
      category: "Niños",
    },
    {
      id: 2,
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Fox_Broadcasting_Company_logo_%282019%29.svg",
      name: "Fox",
      category: "Comedia",

    },
    {
      id: 3,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Televisa_Deportes_logo.png/1200px-Televisa_Deportes_logo.png",
      name: "Televisa Deportes",
      category: "Deportes",

    },
    {
      id: 4,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Bandamax_2015_Logo.png/200px-Bandamax_2015_Logo.png",
      name: "Bandamax",
      category: "Música",
    },
    {
      id: 5,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Disney_XD_-_2015.svg/640px-Disney_XD_-_2015.svg.png",
      name: "Disney XD",
      category: "Niños",

    }
  ]);

  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: 'Deportes', code: 'dp' },
    { name: 'Comedia', code: 'RM' },
    { name: 'Niños', code: 'LDN' },
    { name: 'Terror', code: 'IST' },
    { name: 'Música', code: 'PRS' }
  ];





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
        <div className='w-full flex items-center justify-start gap-x-6'>
          <IconField iconPosition="left" className='border border-gray-300 rounded-lg w-[70%] '>
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText placeholder="Buscar canal" className='w-full px-10 h-12' />
          </IconField>

          <div className='w-[15%] flex items-center justify-center'>
            <i
              className={`pi pi-filter mr-2`}
              style={{ fontSize: '1.2rem' }}
            />
            <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
              placeholder="Filtrar por categoría" className="w-full border border-gray-300 md:w-14rem " checkmark={true} highlightOnSelect={false} />
          </div>
        </div>


        {/* Tabla de registros */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr className='bg-gray-100 '>
              <th scope="col" className="px-6 py-3 ">Logo</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3 ">Categoría</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 ">
                  <img src={channel.logo} alt={channel.name} className="w-8 h-8 object-contain" />
                </td>
                <td className="px-6 py-4">{channel.name}</td>
                <td className="px-6 py-4 ">{channel.category}</td>
                <td className="px-6 py-4 flex gap-x-2">
                  <button>editar</button>
                  <button>eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>


      {/* Modal de form para agregar canal */}
      <ChannelModal
        visible={visible}
        setVisible={setVisible}
      />


    </>

  );
};
