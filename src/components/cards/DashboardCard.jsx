import React from 'react'

export const DashboardCard = ({ name, quantity, icon }) => {
    return (
        <div className='bg-white rounded-lg p-6 flex flex-col gap-y-4 shadow-sm'>
            <div className='flex'>
                <i
                    className={`${icon} mr-4`}
                    style={{ fontSize: '1.5rem' }}
                />
                <span className='font-semibold text-lg'>
                    {name}
                </span>
            </div>
            <span className='text-blue-500 font-bold text-3xl'>
                {quantity}
            </span>
        </div>
    )
}
