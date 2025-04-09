import React from 'react'
import { useState } from 'react'
import { ChannelListModal } from './ChannelPackage/ChannelListModal'
import { Menu } from 'primereact/menu'; // Importa el componente Menu de PrimeReact
import { ChannelPackageService } from '../../../../services/ChannelPackageService';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '../../../CustomAlerts';

export const CardPackage = ({ channelPackage }) => {
    const [visible, setVisible] = useState(false)
    const [channelList, setChannelList] = useState([]);
    const menuRef = React.useRef(null); // Referencia para el menú

    const deleteChannelpackage = async (id) => {
        showConfirmAlert(
          '¿Estás seguro de que deseas eliminar este paquete?',
          async () => {
            try {
              const response = await ChannelPackageService.deleteChannelPackage(id);
              console.log(response)
              if (response.status === 'OK') {
                showSuccessAlert(response.message, () => {
                });
              } else {
                showErrorAlert(response.message || 'Ocurrió un error al eliminar el paquete de canal');
              }
            } catch (error) {
              console.error("Error al eliminar el paquete de canal:", error);
              showErrorAlert('Ocurrió un error de conexión con el servidor');
            }
          },
          () => {
            // Callback para cuando el usuario cancela
            console.log('Eliminación cancelada por el usuario');
          }
        );
      };

    // Elementos del menú
    const menuItems = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                // Aquí iría la lógica para editar
                console.log('Editar paquete:', channelPackage.id);
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => {
                // Aquí iría la lógica para eliminar
                console.log('Eliminar paquete:', channelPackage.id);
                deleteChannelpackage(channelPackage.id);
            }
        }
    ];

    return (
        <>
            <div className='bg-white h-fit rounded-lg py-6 px-4 shadow-sm'>
                {/* Encabezado de la card */}
                <div className='flex items-center justify-between'>
                    <span className='text-lg font-medium text-gray-800'>{channelPackage.name}</span>
                    <i 
                        className={`pi pi-ellipsis-v mr-2 p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer`}
                        style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}
                        onClick={(e) => menuRef.current.toggle(e)} // Muestra el menú al hacer clic
                        aria-controls="popup_menu"
                        aria-haspopup
                    />
                    {/* Menú flotante */}
                    <Menu 
                        model={menuItems} 
                        popup 
                        ref={menuRef} 
                        id="popup_menu"
                        className="text-sm"
                    />
                </div>
                {/* body de la card */}
                <div className='flex flex-col mt-3 gap-y-3'>
                    <span className='text-gray-800 font-light text-base'>{channelPackage.description}</span>
                    <span className='text-gray-800 font-light text-base'>{channelPackage.channels.length} canales incluidos</span>
                    <span className='text-blue-500 font-semibold text-xl'>${channelPackage.amount}/mes</span>
                    <button 
                        onClick={() => setVisible(true)} 
                        className='w-full border border-gray-200 flex items-center justify-center rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition'
                    >
                        <i 
                            className={`pi pi-eye p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer`}
                            style={{ fontSize: '1rem', verticalAlign: 'middle' }}
                        />
                        Ver listado de canales
                    </button>
                </div>
            </div>

            <ChannelListModal 
                visible={visible} 
                setVisible={setVisible} 
                packageName={channelPackage.name} 
                channelList={channelPackage.channels}
            />
        </>
    )
}