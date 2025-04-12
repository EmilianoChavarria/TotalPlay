import { Dialog } from 'primereact/dialog';
import React from 'react'

export const ChannelListModal = ({ visible, setVisible, packageName, channelList }) => {

    return (
        <Dialog
            header="Listado de canales"
            visible={visible}
            className="w-full md:w-[60vw] xl:w-[60vw] 2xl:w-[45vw]"
            onHide={() => visible && setVisible(false)}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
                {channelList.map(channel => (
                    <div
                        key={channel.id}
                        className='flex items-center gap-2 p-2 border rounded-lg'
                    >
                        <img
                            src={`data:image/jpeg;base64,${channel.logoBean?.image}`}
                            alt={channel.name}
                            className='w-8 h-8 object-contain'
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/32';
                            }}
                        />

                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold whitespace-nowrap'>{channel.name}</p>
                            <p className='text-sm text-gray-600'>{channel.category.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {channelList.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No hay canales en este paquete
                </div>
            )}
        </Dialog>
    )
}