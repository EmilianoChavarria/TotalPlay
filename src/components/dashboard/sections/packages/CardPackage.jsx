import React from 'react'
import { useState } from 'react'
import { ChannelListModal } from './ChannelPackage/ChannelListModal'

export const CardPackage = ({ channelPackage }) => {

    const [visible, setVisible] = useState(false)
    const [channelList, setChannelList] = useState([]);

    return (
        <>
            <div className='bg-white h-fit rounded-lg py-6 px-4 shadow-sm'>
                {/* Encabexado de la card */}
                <div className='flex items-center justify-between'>
                    <span className='text-lg font-medium text-gray-800'>{channelPackage.name}</span>
                    <i className={`pi pi-ellipsis-v mr-2 p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer `}
                        style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}
                    />
                </div>
                {/* body de la card */}
                <div className='flex flex-col mt-3 gap-y-3'>
                    <span className='text-gray-800 font-light text-base'>{channelPackage.description}</span>
                    <span className='text-gray-800 font-light text-base'>{channelPackage.channels.length} canales incluidos</span>
                    <span className='text-blue-500 font-semibold text-xl'>${channelPackage.amount}/mes</span>
                    <button onClick={() => {
                        setVisible(true);
                    }} className='w-full border border-gray-200 flex items-center justify-center rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition'>
                        <i className={`pi pi-eye p-2 rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer `}
                            style={{ fontSize: '1rem', verticalAlign: 'middle' }}
                        />
                        Ver listado de canales</button>

                </div>



            </div>

            <ChannelListModal visible={visible} setVisible={setVisible} packageName={channelPackage.name} channelList={channelPackage.channels}/>

        </>
    )
}
