import React from 'react'
import { CardPackage } from '../CardPackage'
import { ChannelPackageModal } from './ChannelPackageModal'
import { useState } from 'react';
import { ChannelPackageService } from '../../../../../services/ChannelPackageService';
import { useEffect } from 'react';

export const ChannelPackage = () => {
  const [visible, setVisible] = useState(false);
  const [channelPackages, setChannelPackages] = useState([]);

  const getAllChannelPackages = async () => {
    try {
      const response = await ChannelPackageService.getAllChannelPackages();
      console.log(response);
      setChannelPackages(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePackagesSaved = () => {
    getAllChannelPackages(); // Volver a cargar los canales
  };

  useEffect(() => {
    getAllChannelPackages();
  }, []);



  return (
    <>

      <div className='flex flex-col'>
        {/* Contenedor del encabezado */}
        <div className='w-full flex flex-col md:flex-row items-center justify-between'>
          <h2 className='text-2xl font font-semibold whitespace-nowrap'>Gestión de paquetes de canales</h2>
          <button onClick={() => {
            setVisible(true);
          }} className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition '>
            <i className={`pi pi-plus mr-2`}
              style={{ fontSize: '1rem', verticalAlign: 'middle' }}
            />
            Agregar paquete
          </button>
        </div>

        {/* Contenedor de canales */}
        <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>

          {/* Mapeo de los paquetes de canales */}
          {channelPackages.map((channelPackage) => (
            <CardPackage key={channelPackage.id} channelPackage={channelPackage} />
          ))}



        </section>
      </div>

      {/* Modal de Paquete de canales */}
      <ChannelPackageModal visible={visible}
        setVisible={setVisible} 
        onSuccess={handlePackagesSaved}
        />
    </>
  )
}
