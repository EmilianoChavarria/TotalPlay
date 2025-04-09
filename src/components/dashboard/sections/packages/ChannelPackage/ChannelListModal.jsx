import { Dialog } from 'primereact/dialog';
import React from 'react'
import { useState } from 'react';

export const ChannelListModal = ({ visible, setVisible, packageName, channelList }) => {

    // const [allChannels, setAllChannels] = useState([
    //     {
    //         id: 1,
    //         logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Discovery_Kids_Logo_2021-Presente.webp",
    //         name: "Discovery Kids",
    //         category: "Niños",
    //     },
    //     {
    //         id: 2,
    //         logo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Fox_Broadcasting_Company_logo_%282019%29.svg",
    //         name: "Fox",
    //         category: "Comedia",
    //     },
    //     {
    //         id: 3,
    //         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Televisa_Deportes_logo.png/1200px-Televisa_Deportes_logo.png",
    //         name: "Televisa Deportes",
    //         category: "Deportes",
    //     },
    //     {
    //         id: 4,
    //         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Bandamax_2015_Logo.png/200px-Bandamax_2015_Logo.png",
    //         name: "Bandamax",
    //         category: "Música",
    //     },
    //     {
    //         id: 5,
    //         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Disney_XD_-_2015.svg/640px-Disney_XD_-_2015.svg.png",
    //         name: "Disney XD",
    //         category: "Niños",
    //     }
    // ]);

    return (
        <Dialog
            header={`Listado de canales`}
            visible={visible}
            className='w-full md:w-[60vw] xl:w-[60vw] 2xl:w-[45vw]'
            onHide={() => { if (!visible) return; setVisible(false); }}
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