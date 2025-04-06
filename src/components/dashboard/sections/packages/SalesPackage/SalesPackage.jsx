import React from 'react'
import { CardPackage } from '../CardPackage'
import { useState } from 'react';
import { SalesPackageModal } from './SalesPackageModal';

export const SalesPackage = () => {

    const [visible, setVisible] = useState(false);

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
                </section>
            </div>
            <SalesPackageModal visible={visible} setVisible={setVisible}/>
        </>
    )
}
