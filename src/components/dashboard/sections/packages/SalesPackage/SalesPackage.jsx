import React from 'react'
import { CardPackage } from '../CardPackage'
import { useState } from 'react';
import { SalesPackageModal } from './SalesPackageModal';
import { SalesPackageService } from '../../../../../services/SalesPackageService';
import { useEffect } from 'react';

export const SalesPackage = () => {

    const [visible, setVisible] = useState(false);

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
                            <div key={item.id} className='bg-white p-4 rounded-lg shadow-sm flex flex-col'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-lg font-medium text-gray-800'>{item.name}</span>
                                    <i className={`pi pi-ellipsis-v mr-2 p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer `}
                                        style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}
                                    />
                                </div>
                                <span>
                                    ${item.totalAmount}/mes
                                </span>
                                <span>
                                    Incluye {item.channelPackage.channels.length} canales
                                </span>
                                <span>
                                    Incluye telefonía
                                </span>
                            </div>
                        )
                    }
                    )}
                </section>
            </div>
            <SalesPackageModal visible={visible} setVisible={setVisible} />
        </>
    )
}
