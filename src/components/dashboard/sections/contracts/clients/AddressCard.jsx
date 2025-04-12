import React from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { classNames } from 'primereact/utils';

export const AddressCard = ({ address, isSelected, onClick }) => {
    const { hasRole } = useAuth();

    return (
        <div 
            className={classNames(
                'border rounded-md flex flex-col px-4 py-4 shadow-sm cursor-pointer transition-all duration-200',
                {
                    'border-blue-500 bg-blue-50 ring-2 ring-blue-200': isSelected,
                    'border-gray-200 hover:border-gray-300': !isSelected
                }
            )}
            onClick={onClick}
        >
            <div className='w-full flex justify-between items-center'>
                <span className='text-sm font-semibold'>{address?.name}</span>
                {hasRole('ADMIN') && (
                    <i
                        className={`pi pi-ellipsis-v rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer`}
                        style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}
                        onClick={(e) => {
                            e.stopPropagation(); // Evitar que active la selección
                            // menuRef.current.toggle(e);
                        }}
                        aria-controls="popup_menu"
                        aria-haspopup
                    />
                )}
            </div>
            <div className='text-sm font-light mt-3'>
                <p>{address?.street} #{address?.number}</p>
                <p>{address?.city}, {address?.state} {address?.zipCode}</p>
            </div>
        </div>
    );
};