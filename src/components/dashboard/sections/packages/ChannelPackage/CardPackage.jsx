import React, { useState } from 'react';
import { ChannelListModal } from './ChannelListModal';
import { Menu } from 'primereact/menu';
import { ChannelPackageService } from '../../../../../services/ChannelPackageService';
import { showErrorAlert, showSuccessAlert,showConfirmAlert } from '../../../../CustomAlerts';

export const CardPackage = ({ channelPackage, onEdit, onDeleteSuccess }) => {
    const [visibleListModal, setVisibleListModal] = useState(false);
    const menuRef = React.useRef(null);
    const isDisponible = channelPackage.status === 'DISPONIBLE';


    const handleDelete = async () => {
        showConfirmAlert('¿Deseas desactivar este paquete de canales?', async () => {
            try {
                const response = await ChannelPackageService.deleteChannelPackage(channelPackage.id);
    
                if (response.status === 'OK') {
                    showSuccessAlert(response.message || 'Paquete descativado correctamente');
                    onDeleteSuccess?.();
                } else {
                    showErrorAlert(response.message || 'Error al descativar el paquete');
                }
            } catch (error) {
                console.error("Error al elidescativarminar:", error);
                showErrorAlert('Error de conexión con el servidor');
            }
        });
    };
    
    const handleActive = async () => {
        showConfirmAlert('¿Deseas activar este paquete de canales?', async () => {
            try {
                const response = await ChannelPackageService.activeChannelPackage(channelPackage.id);
    
                if (response.status === 'OK') {
                    showSuccessAlert(response.message || 'Paquete activado');
                    onDeleteSuccess?.();
                } else {
                    showErrorAlert(response.message || 'Error al activar el paquete');
                }
            } catch (error) {
                console.error("Error al activar:", error);
                showErrorAlert('Error de conexión con el servidor');
            }
        });
    };
    

    const menuItems = [

        ...(isDisponible
            ? [
                {
                    label: 'Editar',
                    icon: 'pi pi-pencil',
                    command: () => {
                        if (onEdit) onEdit(channelPackage);
                    }
                }, {
                    label: 'Desactivar',
                    icon: 'pi pi-stop-circle',
                    command: () => handleDelete()
                }

            ]
            : [{
                label: 'Activar',
                icon: 'pi pi-check-circle',
                command: () => handleActive()
            }]
        )
    ];


    return (
        <>
            <div className={`relative bg-white h-fit rounded-lg py-6 px-4 shadow-sm hover:shadow-md transition-shadow ${isDisponible ? '' : 'opacity-60'}`}>

                <div
                    className={`absolute top-0 left-0 h-full w-1 rounded-l-lg ${isDisponible ? 'bg-blue-500' : 'bg-gray-400'}`}
                    title={isDisponible ? 'Paquete activo' : 'Paquete inactivo'}
                />

                <div className='flex items-center justify-between'>
                    <span className='text-lg font-medium text-gray-800 truncate max-w-[70%]' title={channelPackage.name}>
                        {channelPackage.name}
                    </span>
                    <button
                        className='p-2 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onClick={(e) => menuRef.current.toggle(e)}
                        aria-label="Opciones del paquete"
                        aria-controls="package_menu"
                        aria-haspopup
                    >
                        <i className='pi pi-ellipsis-v' style={{ fontSize: '0.9rem' }} />
                    </button>
                    <Menu model={menuItems} popup ref={menuRef} id="package_menu" className="text-sm shadow-lg" />
                </div>

                <div className='flex flex-col mt-3 gap-y-3'>
                    <p className='text-gray-600 text-base line-clamp-2' title={channelPackage.description}>
                        {channelPackage.description || 'Sin descripción'}
                    </p>

                    <div className='flex items-center justify-between'>
                        <span className='text-gray-700 text-sm'>
                            {channelPackage.channels.length} canales incluidos
                        </span>

                        <button
                            onClick={() => setVisibleListModal(true)}
                            className='flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors'
                        >
                            <i className='pi pi-eye' style={{ fontSize: '1rem' }} />
                            Ver canales
                        </button>
                    </div>
                </div>
            </div>

            <ChannelListModal
                visible={visibleListModal}
                setVisible={setVisibleListModal}
                packageName={channelPackage.name}
                channelList={channelPackage.channels}
            />
        </>
    );

};