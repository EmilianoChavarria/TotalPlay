import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { AddressCard } from './AddressCard';
import { AddressService } from '../../../../../services/AddressService';
import { AddressModal } from './AddressModal';

export const AddressManageModals = ({ visibleD, setVisibleD, user }) => {
    const [visible, setVisible] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await AddressService.getAddressByClientId(user?.userId);
            console.log("Respuesta de direcciones:", response); // Para debug
            if (response.status === 'OK') {
                setAddresses(response.data || []);
            }
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSaved = () => {
        fetchAddresses();
    };

    const renderAddressContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center mt-4">
                    <i className="pi pi-spinner pi-spin" style={{ fontSize: '2rem' }}></i>
                </div>
            );
        }

        if (addresses.length === 0) {
            return <p className="text-gray-500 text-center py-4">No hay direcciones registradas</p>;
        }

        return (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {addresses.map((address) => (
                    <AddressCard key={address.id} address={address} />
                ))}
            </div>
        );
    };

    useEffect(() => {
        if (visibleD) {
            
            fetchAddresses();
        }
    }, [visibleD]);

    return (
        <>
            <Dialog
                header={`Direcciones de ${user?.name} ${user?.lastName}`}
                visible={visibleD}
                className='w-full md:w-[30vw]'
                onHide={() => {
                    setVisibleD(false);
                    setVisible(false);
                }}
            >

                {renderAddressContent()}
            </Dialog>

            <AddressModal
                visibleD={visible}
                setVisibleD={setVisible}
                user={user}
                onSuccess={handleAddressSaved}
            />
        </>
    );
};