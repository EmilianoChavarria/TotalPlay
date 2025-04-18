import React, { useState, useEffect } from 'react';
import { CardPackage } from './CardPackage';
import { ChannelPackageModal } from './ChannelPackageModal';
import { ChannelPackageService } from '../../../../../services/ChannelPackageService';
import { ConfirmDialog } from 'primereact/confirmdialog'; // 

export const ChannelPackage = () => {
  const [visible, setVisible] = useState(false);
  const [channelPackages, setChannelPackages] = useState([]);
  const [packageToEdit, setPackageToEdit] = useState(null);
  const [statusFilter, setStatusFilter] = useState('DISPONIBLE'); 

  const getAllChannelPackages = async () => {
    try {
      const response = await ChannelPackageService.getAllChannelPackages();
      setChannelPackages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPackage = (channelPackage) => {
    setPackageToEdit(channelPackage);
    setVisible(true);
  };

  const handlePackagesSaved = () => {
    getAllChannelPackages();
    setPackageToEdit(null);
  };

  useEffect(() => {
    getAllChannelPackages();
  }, []);

  return (
    <>
      <ConfirmDialog />

      <div className='flex flex-col'>
        <div className='w-full flex flex-col md:flex-row items-center justify-between'>
          <h2 className='text-2xl font font-semibold whitespace-nowrap'>Gestión de paquetes de canales</h2>
          <button
            onClick={() => {
              setVisible(true);
              setPackageToEdit(null);
            }}
            className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition '>
            <i className={`pi pi-plus mr-2`} style={{ fontSize: '1rem', verticalAlign: 'middle' }} />
            Agregar paquete
          </button>


          <button
            onClick={() => setStatusFilter(prev => prev === 'DISPONIBLE' ? 'OBSOLETO' : 'DISPONIBLE')}
            className={`px-4 py-2 rounded-md border flex items-center gap-2 transition ${statusFilter === 'DISPONIBLE'
              ? 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600'
              : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
              }`}
          >
            <i className={`pi ${statusFilter === 'DISPONIBLE' ? 'pi-ban' : 'pi-check-circle'}`} />
            {statusFilter === 'DISPONIBLE' ? 'Ver inactivos' : 'Ver activos'}
          </button>
        </div>



        <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          {channelPackages.filter(pkg => pkg.status === statusFilter && pkg.name !== '').length === 0 ? (
            <div className="col-span-full mt-6">
              <div className="flex items-center justify-center bg-white border border-grey-500 text-gray-500 text-sm font-medium px-4 py-3 rounded-md shadow-sm">
                <i className="pi pi-info-circle mr-2" style={{ fontSize: '1rem', color: "grey" }} />
                No hay paquetes {statusFilter === 'DISPONIBLE' ? 'disponibles' : 'obsoletos'}.
              </div>
            </div>
          ) : (
            channelPackages
              .filter(pkg => pkg.status === statusFilter && pkg.name !== '')
              .map(pkg => (
                <CardPackage
                  key={pkg.id}
                  channelPackage={pkg}
                  onEdit={() => handleEditPackage(pkg)}
                  onDeleteSuccess={getAllChannelPackages}
                />
              ))
          )}
        </section>


      </div>

      <ChannelPackageModal
        visible={visible}
        setVisible={setVisible}
        onSuccess={handlePackagesSaved}
        packageToEdit={packageToEdit}
      />
    </>
  );
};
