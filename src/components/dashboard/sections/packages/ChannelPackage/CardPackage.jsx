import React, { useState } from 'react';
import { ChannelListModal } from './ChannelListModal';
import { Menu } from 'primereact/menu';
import { ChannelPackageService } from '../../../../../services/ChannelPackageService';
import { showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';
import Swal from 'sweetalert2';

export const CardPackage = ({ channelPackage, onEdit, onDeleteSuccess }) => {
    const [visibleListModal, setVisibleListModal] = useState(false);
    const menuRef = React.useRef(null);


    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar este paquete de canales?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
        });
    
        if (result.isConfirmed) {
            try {
                const response = await ChannelPackageService.deleteChannelPackage(channelPackage.id);
    
                if (response.status === 'OK') {
                    showSuccessAlert(response.message || 'Paquete eliminado correctamente');
                    if (onDeleteSuccess) onDeleteSuccess(); // Actualiza la lista desde el padre
                } else {
                    showErrorAlert(response.message || 'Error al eliminar el paquete');
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
                showErrorAlert('Error de conexión con el servidor');
            }
        }
    };

    const menuItems = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                if (onEdit) onEdit(channelPackage);
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => handleDelete()
        }
    ];

    return (
        <>
            
            <div className='bg-white h-fit rounded-lg py-6 px-4 shadow-sm hover:shadow-md transition-shadow'>
                {/* Encabezado de la card */}
                <div className='flex items-center justify-between'>
                    <span className='text-lg font-medium text-gray-800 truncate max-w-[70%]' 
                          title={channelPackage.name}>
                        {channelPackage.name}
                    </span>
                    
                    {/* Botón de menú */}
                    <button
                        className='p-2 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onClick={(e) => menuRef.current.toggle(e)}
                        aria-label="Opciones del paquete"
                        aria-controls="package_menu"
                        aria-haspopup
                    >
                        <i className='pi pi-ellipsis-v' style={{ fontSize: '0.9rem' }} />
                    </button>
                    
                    {/* Menú  */}
                    <Menu 
                        model={menuItems} 
                        popup 
                        ref={menuRef} 
                        id="package_menu"
                        className="text-sm shadow-lg"
                    />
                </div>
                
                {/* Cuerpo de la card */}
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
                            aria-label={`Ver canales del paquete ${channelPackage.name}`}
                        >
                            <i className='pi pi-eye' style={{ fontSize: '1rem' }} />
                            Ver canales
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal para ver la lista de canales */}
            <ChannelListModal 
                visible={visibleListModal} 
                setVisible={setVisibleListModal} 
                packageName={channelPackage.name} 
                channelList={channelPackage.channels}
            />
        </>
    );
};