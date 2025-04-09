import React from 'react'
import { CardPackage } from '../CardPackage'
import { useState } from 'react';
import { SalesPackageModal } from './SalesPackageModal';
import { SalesPackageService } from '../../../../../services/SalesPackageService';
import { useEffect } from 'react';
import { ChannelListModal } from '../ChannelPackage/ChannelListModal';

export const SalesPackage = () => {

    const [visible, setVisible] = useState(false);
    const [visibleChannel, setVisibleChannel] = useState(false);

    const [salesPackage, setSalesPackage] = useState([]);

    const getSalesPackage = async () => {
        try {
            const response = await SalesPackageService.getAllSalesPackage();
            console.log(response)
            setSalesPackage(response.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        getSalesPackage();
    }, [])

    return (
        <>
            <div className='flex flex-col'>
                {/* Contenedor del encabezado */}
                <div className='w-full flex flex-col md:flex-row items-center justify-between'>
                    <h2 className='text-2xl font font-semibold whitespace-nowrap'>Gestión de paquetes de ventas</h2>
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
                    {/* <CardPackage />
                    <CardPackage />
                    <CardPackage />
                    <CardPackage /> */}

                    {salesPackage.map((item) => {
                        return (
                            <>
                                <div key={item.id} className='bg-white p-6 rounded-lg shadow-sm flex flex-col'>

                                    {/* Encabezado de card */}
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center justify-start'>
                                            <i className={`pi pi-box mr-2 rounded-lg text-blue-500 hover:bg-gray-100 hover:cursor-pointer `}
                                                style={{ fontSize: '1.3rem', verticalAlign: 'middle' }}
                                            />
                                            <span className='text-lg font-medium text-gray-800'>{item.name}</span>
                                        </div>
                                        <i className={`pi pi-ellipsis-v mr-2 p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer `}
                                            style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}
                                        />
                                    </div>
                                    <div className='flex items-center justify-between pt-2 pb-4 border-b border-gray-200'>
                                        <div className='flex items-center justify-start'>
                                            <i className={`pi pi-wifi mr-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer `}
                                                style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}
                                            />
                                            {/* TODO:Quitar el valor harcodeado cuando Alex termine esto */}
                                            <span className='text-gray-600'>
                                                300 Mbps
                                            </span>
                                        </div>
                                        <span className='text-2xl font-bold text-blue-600'>
                                            ${item.totalAmount}/mes
                                        </span>
                                    </div>
                                    <div className='py-3 flex flex-col'>
                                        <div className='mb-2'>
                                            <i className={`pi pi-desktop mr-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:cursor-pointer `}
                                                style={{ fontSize: '1.1rem', verticalAlign: 'middle' }}
                                            />
                                            <span className='text-md font-medium text-gray-700'>Paquete de canales incluido:</span>
                                        </div>
                                        <div className='flex items-center justify-between bg-gray-50 rounded-md p-4'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium text-gray-900'>{item.channelPackage.name}</span>
                                                <span className='text-sm text-gray-600'>Incluye {item.channelPackage.channels.length} canales</span>
                                            </div>
                                            {/* <span className='text-blue-600 font-semibold'>${item.channelPackage.amount}/mes</span> */}
                                            <button className='hover:bg-gray-100 rounden-md' onClick={() => {
                                                // setChannelPackage(item.channelPackage);
                                                setVisibleChannel(true);
                                            }}>
                                                <i className={`pi pi-eye p-2 rounded-lg text-gray-800 hover:cursor-pointer `}
                                                    style={{ fontSize: '1rem', verticalAlign: 'middle' }}
                                                />
                                                <span className='text-gray-800 hover:text-blue-500'>
                                                    ver canales
                                                </span>
                                            </button>
                                        </div>

                                    </div>

                                </div>
                                < ChannelListModal
                                    visible={visibleChannel}
                                    setVisible={setVisibleChannel}
                                    channelList={item.channelPackage.channels}
                                />
                            </>
                        )
                    }
                    )}
                </section>
            </div>
            <SalesPackageModal visible={visible} setVisible={setVisible} />


        </>
    )
}
