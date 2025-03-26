import React from 'react'

export const CardPackage = () => {
    return (
        <div className='bg-white rounded-lg py-6 px-4 shadow-sm'>
            {/* Encabexado de la card */}
            <div className='flex items-center justify-between'>
                <span className='text-lg font-medium text-gray-800'>Paquete Premium</span>
                <i className={`pi pi-ellipsis-v mr-2 p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer `}
                    style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}
                />
            </div>
            {/* body de la card */}
            <div className='flex flex-col mt-3 gap-y-3'>
                <span className='text-gray-800 font-light text-base'>Velocidad: 100mbs</span>
                <span className='text-gray-800 font-light text-base'>150 canales incluidos</span>
                <span className='text-blue-500 font-semibold text-xl'>$300.00/mes</span>
                <button className='w-full border border-gray-200 flex items-center justify-center rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition'>
                    <i className={`pi pi-eye p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer `}
                        style={{ fontSize: '1rem', verticalAlign: 'middle' }}
                    />
                    Ver listado de canales</button>

            </div>



        </div>
    )
}
