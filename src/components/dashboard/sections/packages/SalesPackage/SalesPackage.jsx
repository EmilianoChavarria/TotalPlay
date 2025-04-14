import React, { useState, useEffect, useRef } from 'react';
import { SalesPackageModal } from './SalesPackageModal';
import { SalesPackageService } from '../../../../../services/SalesPackageService';
import { ChannelListModal } from '../ChannelPackage/ChannelListModal';
import { useAuth } from '../../../../../context/AuthContext';
import { Menu } from 'primereact/menu';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';

export const SalesPackage = () => {
    const { hasRole } = useAuth();
    const menuRef = useRef(null); 
    const [selectedPackage, setSelectedPackage] = useState(null); 

    const [visible, setVisible] = useState(false);
    const [visibleChannel, setVisibleChannel] = useState(false);
    const [salesPackage, setSalesPackage] = useState([]);

    const getSalesPackage = async () => {
        try {
            const response = await SalesPackageService.getAllSalesPackage();
            console.log(response);
            setSalesPackage(response.data);
        } catch (error) {
            console.error("Error al obtener paquetes:", error);
        }
    };

    const deleteSalesPackage = async (id) => {
        showConfirmAlert(
            '¿Estás seguro de que deseas eliminar este paquete?',
            async () => {
                try {
                    const response = await SalesPackageService.deleteSalesPackage(id);
                    console.log(response)
                    if (response.status === 'OK') {
                        showSuccessAlert(response.message, () => {
                            getSalesPackage(); 
                            setSelectedPackage(null);
                        });
                    } else {
                        showErrorAlert(response.message || 'Ocurrió un error al eliminar el paquete de ventas');
                    }
                } catch (error) {
                    console.error("Error al eliminar el paquete de ventas:", error);
                    showErrorAlert('Ocurrió un error de conexión con el servidor');
                }
            },
            () => {
                console.log('Eliminación cancelada por el usuario');
            }
        );
    };

    const menuItems = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                if (selectedPackage) {
                    console.log('Editar paquete:', selectedPackage.id);
                }
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => {
                if (selectedPackage) {
                    console.log('Eliminar paquete:', selectedPackage.id);
                    deleteSalesPackage(selectedPackage.id);
                }
            }
        }
    ];

    const handleSalesPackageSaved = () => {
        getSalesPackage();
    };

    useEffect(() => {
        getSalesPackage();
    }, []);

    return (
        <>
            <div className='flex flex-col'>
                <div className='w-full flex flex-col md:flex-row items-center justify-between'>
                    <h2 className='text-2xl font-semibold whitespace-nowrap'>Gestión de paquetes de ventas</h2>
                    {hasRole('ADMIN') && (
                        <button
                            onClick={() => setVisible(true)}
                            className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition'
                        >
                            <i className="pi pi-plus mr-2" />
                            Agregar paquete
                        </button>
                    )}
                </div>

                {/* Lista de paquetes */}
                <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
                    {salesPackage.map((item) => (
                        <div key={item.id} className='bg-white p-6 rounded-lg shadow-sm flex flex-col'>
                            {/* Encabezado de la tarjeta */}
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center justify-start'>
                                    <i className="pi pi-box mr-2 text-blue-500" style={{ fontSize: '1.3rem' }} />
                                    <span className='text-lg font-medium text-gray-800'>{item.name}</span>
                                </div>
                                {hasRole('ADMIN') && (
                                    <>
                                        <i
                                            className="pi pi-ellipsis-v p-2 rounded-lg text-gray-800 hover:bg-gray-100 cursor-pointer"
                                            style={{ fontSize: '0.9rem' }}
                                            onClick={(e) => {
                                                setSelectedPackage(item); 
                                                menuRef.current.toggle(e);
                                            }}
                                            aria-controls="popup_menu"
                                            aria-haspopup
                                        />
                                        <Menu
                                            model={menuItems}
                                            popup
                                            ref={menuRef}
                                            id="popup_menu"
                                            className="text-sm"
                                        />
                                    </>
                                )}
                            </div>

                            {/* Resto del contenido de la tarjeta */}
                            <div className='flex items-center justify-between pt-2 pb-4 border-b border-gray-200'>
                                <div className='flex items-center justify-start'>
                                    <i className="pi pi-wifi mr-2 text-gray-800" style={{ fontSize: '1.2rem' }} />
                                    <span className='text-gray-600'>{item.speed} Mbps</span>
                                </div>
                                <span className='text-2xl font-bold text-blue-600'>${item.totalAmount}/mes</span>
                            </div>

                            {/* Sección de canales */}
                            <div className='py-3 flex flex-col'>
                                <div className='mb-2'>
                                    <i className="pi pi-desktop mr-2 text-gray-600" style={{ fontSize: '1.1rem' }} />
                                    <span className='text-md font-medium text-gray-700'>Paquete de canales incluido:</span>
                                </div>
                                <div className='flex items-center justify-between bg-gray-50 rounded-md p-4'>
                                    <div className='flex flex-col'>
                                        <span className='font-medium text-gray-900'>{item.channelPackage.name}</span>
                                        <span className='text-sm text-gray-600'>Incluye {item.channelPackage.channels.length} canales</span>
                                    </div>
                                    <button
                                        className='hover:bg-gray-100 rounded-md flex items-center'
                                        onClick={() => setVisibleChannel(true)}
                                    >
                                        <i className="pi pi-eye p-2 text-gray-800 cursor-pointer" />
                                        <span className='text-gray-800 hover:text-blue-500'>ver canales</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            {/* Modales */}
            <SalesPackageModal
                visible={visible}
                setVisible={setVisible}
                onSuccess={handleSalesPackageSaved}
            />
            <ChannelListModal
                visible={visibleChannel}
                setVisible={setVisibleChannel}
                channelList={selectedPackage?.channelPackage?.channels || []}
            />
        </>
    );
};