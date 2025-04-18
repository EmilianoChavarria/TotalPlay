import React, { useState, useEffect, useRef } from 'react';
import { SalesPackageModal } from './SalesPackageModal';
import { SalesPackageService } from '../../../../../services/SalesPackageService';
import { ChannelListModal } from '../ChannelPackage/ChannelListModal';
import { useAuth } from '../../../../../context/AuthContext';
import { Menu } from 'primereact/menu';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';

export const SalesPackage = () => {
    const { hasRole } = useAuth();
    const [selectedPackage, setSelectedPackage] = useState();

    const [visible, setVisible] = useState(false);
    const [visibleChannel, setVisibleChannel] = useState(false);
    const [salesPackage, setSalesPackage] = useState([]);
    const [showInactive, setShowInactive] = useState(false);
    const [noInactivePackagesMessage, setNoInactivePackagesMessage] = useState('');

    const getSalesPackage = async () => {
        try {
            const response = await SalesPackageService.getAllSalesPackage();
            console.log("Respuesta del servicio:", response);
            if (Array.isArray(response)) {
                setSalesPackage(response);
            } else if (Array.isArray(response?.data)) {
                setSalesPackage(response.data);
            } else {
                console.warn("Respuesta inesperada:", response);
                setSalesPackage([]);
            }
        } catch (error) {
            console.error("Error al obtener paquetes:", error);
            setSalesPackage([]);
        }
    };


    const deleteSalesPackage = async (id) => {
        showConfirmAlert(
            '¿Estás seguro de que deseas desactivar este paquete?',
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
                        showErrorAlert(response.message || 'Ocurrió un error al desactivar el paquete de ventas');
                    }
                } catch (error) {
                    console.error("Error al desactivar el paquete de ventas:", error);
                    showErrorAlert('Ocurrió un error de conexión con el servidor');
                }
            },
            () => {
                console.log('desactivar cancelada por el usuario');
            }
        );
    };


    const activeChannelPackage = async (id) => {
        showConfirmAlert(
            '¿Estás seguro de que deseas desactivar este paquete?',
            async () => {
                try {
                    const response = await SalesPackageService.activeChannelPackage(id);
                    console.log(response)
                    if (response.status === 'OK') {
                        showSuccessAlert(response.message, () => {
                            getSalesPackage();
                            setSelectedPackage(null);
                        });
                    } else {
                        showErrorAlert(response.message || 'Ocurrió un error al activar el paquete de ventas');
                    }
                } catch (error) {
                    console.error("Error al activar el paquete de ventas:", error);
                    showErrorAlert('Ocurrió un error de conexión con el servidor');
                }
            },
            () => {
                console.log('desactivar cancelada por el usuario');
            }
        );
    };


    const MenuButton = ({ item }) => {
        const menuRef = useRef(null);

        const getMenuItems = () => {
            return item.status
                ? [{
                    label: 'Desactivar',
                    icon: 'pi pi-ban',
                    command: () => {
                        console.log("Desactivar paquete:", item.id);
                        deleteSalesPackage(item.id);
                    }
                }]
                : [{
                    label: 'Activar',
                    icon: 'pi pi-check-circle',
                    command: () => {
                        console.log("Activar paquete:", item.id);
                        activeChannelPackage(item.id);
                    }
                }];
        };

        return (
            <>
                <i
                    className="pi pi-ellipsis-v p-2 rounded-lg text-gray-800 hover:bg-gray-100 cursor-pointer"
                    style={{ fontSize: '0.9rem' }}
                    onClick={(e) => menuRef.current.toggle(e)}
                    aria-controls={`popup_menu_${item.id}`}
                    aria-haspopup
                />
                <Menu
                    model={getMenuItems()}
                    popup
                    ref={menuRef}
                    id={`popup_menu_${item.id}`}
                    className="text-sm"
                />
            </>
        );
    };


    const handleSalesPackageSaved = () => {
        getSalesPackage();
    };

    useEffect(() => {
        getSalesPackage();
    }, []);

    useEffect(() => {
        const inactivePackages = salesPackage.filter((item) => item.status === false);
        if (showInactive && inactivePackages.length === 0) {
            setNoInactivePackagesMessage('No hay paquetes inactivos disponibles.');
        } else {
            setNoInactivePackagesMessage('');
        }
    }, [salesPackage, showInactive]);


    return (
        <>
            <div className='flex flex-col'>
                <div className='w-full flex flex-col md:flex-row items-center justify-between gap-4'>
                    <h2 className='text-2xl font-semibold whitespace-nowrap'>Gestión de paquetes de ventas</h2>

                    {hasRole('ADMIN') && (

                        <>
                            <button
                                onClick={() => setVisible(true)}
                                className='w-full md:w-fit bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition'
                            >
                                <i className="pi pi-plus mr-2" />
                                Agregar paquete
                            </button>

                            <button
                                onClick={() => setShowInactive(prev => !prev)}
                                className={`px-4 py-2 rounded-md border flex items-center gap-2 transition ${showInactive
                                        ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                        : 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600'
                                    }`}
                            >
                                <i className={`pi ${showInactive ? 'pi-check-circle' : 'pi-ban'}`} />
                                {showInactive ? 'Ver activos' : 'Ver inactivos'}
                            </button>
                        </>


                    )}



                </div>

                {noInactivePackagesMessage && (
                    <div className="col-span-full mt-6">
                        <div className="flex items-center justify-center bg-white border border-grey-500 text-gray-500 text-sm font-medium px-4 py-3 rounded-md shadow-sm">
                            <i className="pi pi-info-circle mr-2" style={{ fontSize: '1rem', color: "grey" }} />
                            No hay paquetes de ventas inactivos.
                        </div>
                    </div>
                )}

                <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
                    {salesPackage.length === 0 ? (
                        <div className="col-span-full mt-6">
                            <div className="flex items-center justify-center bg-white border border-grey-500 text-gray-500 text-sm font-medium px-4 py-3 rounded-md shadow-sm">
                                <i className="pi pi-info-circle mr-2" style={{ fontSize: '1rem', color: "grey" }} />
                                Por el momento no hay paquetes disponibles.
                            </div>
                        </div>
                    ) : (
                        salesPackage
                            .filter((item) => item.status === !showInactive)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className={`bg-white p-6 rounded-lg shadow-sm flex flex-col border-l-4 ${item.status ? 'border-blue-500' : 'border-gray-300'
                                        } ${!item.status ? 'opacity-60' : ''}`}
                                >
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center justify-start'>
                                            <i className="pi pi-box mr-2 text-blue-500" style={{ fontSize: '1.3rem' }} />
                                            <span className='text-lg font-medium text-gray-800'>{item.name}</span>
                                        </div>
                                        {hasRole('ADMIN') && (
                                            <MenuButton item={item} />
                                        )}
                                    </div>

                                    <div className='flex items-center justify-between pt-2 pb-4 border-b border-gray-200'>
                                        <div className='flex items-center justify-start'>
                                            <i className="pi pi-wifi mr-2 text-gray-800" style={{ fontSize: '1.2rem' }} />
                                            <span className='text-gray-600'>{item.speed} Mbps</span>
                                        </div>
                                        <span className='text-2xl font-bold text-blue-600'>${item.totalAmount}/mes</span>
                                    </div>

                                    {item.channelPackage ? (
                                        <div className='py-3 flex flex-col'>
                                            <div className='mb-2'>
                                                <i className="pi pi-desktop mr-2 text-gray-600" style={{ fontSize: '1.1rem' }} />
                                                <span className='text-md font-medium text-gray-700'>Paquete de canales incluido:</span>
                                            </div>
                                            <div className='flex items-center justify-between bg-gray-50 rounded-md p-4'>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium text-gray-900'>{item.channelPackage.name}</span>
                                                    <span className='text-sm text-gray-600'>
                                                        Incluye {item.channelPackage.channels?.length || 0} canales
                                                    </span>
                                                </div>
                                                <button
                                                    className='hover:bg-gray-100 rounded-md flex items-center'
                                                    onClick={() => {
                                                        setSelectedPackage(item);
                                                        setVisibleChannel(true);
                                                    }}
                                                >
                                                    <i className="pi pi-eye p-2 text-gray-800 cursor-pointer" />
                                                    <span className='text-gray-800 hover:text-blue-500'>ver canales</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-span-full mt-6">
                                            <div className="flex items-center justify-center bg-blue-100 border border-blue-500 text-blue-500 text-sm font-medium px-4 py-3 rounded-md shadow-sm">
                                                <i className="pi pi-info-circle mr-2" style={{ fontSize: '1rem', color: "blue" }} />
                                                No hay paquete de canales asignado.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                    )}
                </section>
            </div>

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