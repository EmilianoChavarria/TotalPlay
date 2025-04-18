import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef, useState } from 'react';
import { AddressService } from '../../../../services/AddressService';
import { SalesPackageService } from '../../../../services/SalesPackageService';
import { Button } from 'primereact/button';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { AddressCard } from './clients/AddressCard';
import { classNames } from 'primereact/utils';
import { ContractService } from '../../../../services/ContractService';
import { showErrorAlert, showSuccessAlert } from '../../../CustomAlerts';

export const ContractModal = ({ user, visible, setVisible }) => {
    const stepperRef = useRef(null);
    const [addresses, setAddresses] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedPackageId, setSelectedPackageId] = useState(null);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await AddressService.getAddressByClientId(user?.userId);
            if (response.status === 'OK') {
                setAddresses(response.data || []);
            }
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const response = await SalesPackageService.getAllSalesPackage();
            if (response.status === 'OK') {
                const activos = (response.data || []).filter(pkg => pkg.status === true);
                setPackages(activos);
            }
        } catch (error) {
            console.error("Error al obtener los paquetes:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleConfirmContract = async () => {
        if (!selectedAddressId || !selectedPackageId) return;

        const selectedPackage = packages.find(p => p.id === selectedPackageId);

        const contractData = {
            address: selectedAddressId, 
            salesPackage: selectedPackage.name, 
            userId: localStorage.getItem('id'),
            amount: 1
        };
        console.log("Datos del contrato:", contractData);

        try {
            const response = await ContractService.saveContract(contractData);
            console.log("Respuesta del servidor:", response);

            if (response.status === 'CREATED' || response.success) {
                setVisible(false);
                showSuccessAlert(response.message || 'Cliente creado exitosamente', () => {
                    if (onSuccess) {
                        onSuccess();
                    }
                });
            } else {
                setVisible(false);
                showErrorAlert(response.message || 'Ocurrió un error al crear el cliente', () => {
                    setVisible(true);
                });
            }
        } catch (error) {
            console.log("Error al crear el cliente:", error);
            showErrorAlert('Ocurrió un error al procesar la solicitud');
        }

    }
    useEffect(() => {
        if (visible) {
            fetchAddresses();
            fetchPackages();
            setSelectedAddressId(null);
            setSelectedPackageId(null);
        }
    }, [visible]);

    const handleModalHide = () => {
        setVisible(false);
        setSelectedAddressId(null);
        setSelectedPackageId(null);
    };

    const renderAddresses = () => {
        if (loading) {
            return (
                <div className="flex justify-center py-4">
                    <i className="pi pi-spinner pi-spin text-2xl"></i>
                </div>
            );
        }

        if (addresses.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500">
                    No hay direcciones registradas
                </div>
            );
        }

        return addresses.map((address) => (
            <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddressId === address.id}
                onClick={() => setSelectedAddressId(address.id)}
            />
        ));
    };

    const renderPackages = () => {
        if (loading) {
            return (
                <div className="flex justify-center col-span-3 py-4">
                    <i className="pi pi-spinner pi-spin text-2xl"></i>
                </div>
            );
        }

        if (packages.length === 0) {
            return (
                <div className="text-center col-span-3 py-4 text-gray-500">
                    No hay paquetes disponibles
                </div>
            );
        }

        return packages.map((packageItem) => (
            <div
                key={packageItem.id}
                className={classNames(
                    'flex flex-col p-4 border rounded-md shadow-sm cursor-pointer transition-all duration-200 h-full',
                    {
                        'border-blue-500 bg-blue-50 ring-2 ring-blue-200': selectedPackageId === packageItem.id,
                        'border-gray-200 hover:border-gray-300': selectedPackageId !== packageItem.id
                    }
                )}
                onClick={() => setSelectedPackageId(packageItem.id)}
            >
                <h5 className='font-semibold text-lg mb-2'>{packageItem.name}</h5>
                <p className='text-xl font-bold text-blue-600 mb-3'>${packageItem.totalAmount}/mes</p>
                <div className='flex flex-col gap-y-2 mt-auto'>
                    <p className='text-sm flex items-center'>
                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                        {packageItem.channelPackage.channels.length} canales incluidos
                    </p>
                    <p className='text-sm flex items-center'>
                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                        Velocidad: {packageItem.speed} Mbps
                    </p>
                    <p className='text-sm flex items-center'>
                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                        Instalación gratuita
                    </p>
                    <p className='text-sm flex items-center'>
                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                        Soporte técnico 24/7
                    </p>
                </div>
            </div>
        ));
    };

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    const selectedPackage = packages.find(p => p.id === selectedPackageId);

    return (
        <Dialog
            header={`Crear contrato para ${user?.name} ${user?.lastName}`}
            visible={visible}
            className='w-full md:w-[70vw] lg:w-[60vw] xl:w-[50vw]'
            onHide={handleModalHide}
            modal
            dismissableMask

        >
            <Stepper ref={stepperRef} className="custom-stepper">
                <StepperPanel header="Dirección de servicio">
                    <div className="flex flex-col gap-3 mb-4">
                        <h4 className="font-bold mb-3">Selecciona la dirección de servicio</h4>
                        {renderAddresses()}
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            label="Cancelar"
                            severity="secondary"
                            icon="pi pi-times"
                            onClick={handleModalHide}
                        />
                        <Button
                            label="Siguiente"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            onClick={() => stepperRef.current.nextCallback()}
                            disabled={!selectedAddressId}
                        />
                    </div>
                </StepperPanel>

                <StepperPanel header="Selección de paquete">
                    <div className="flex flex-col gap-4 mb-4">
                        <h4 className="font-bold mb-3">Selecciona un paquete de ventas</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {renderPackages()}
                        </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            label="Atrás"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
                            label="Siguiente"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            onClick={() => stepperRef.current.nextCallback()}
                            disabled={!selectedPackageId}
                        />
                    </div>
                </StepperPanel>

                <StepperPanel header="Confirmación">
                    <div className="mb-4">
                        <h4 className="font-bold mb-3">Resumen del contrato</h4>

                        <div className="card p-4 mb-4">
                            <h5 className="font-semibold mb-2">Datos del cliente</h5>
                            <div className="flex flex-col items-center justify-around md:flex-row">
                                <p className="text-sm mb-2">
                                    <span className="font-medium">Nombre completo:</span><br />
                                    {user?.name} {user?.lastName} {user?.surname}
                                </p>
                                <p className="text-sm mb-2">
                                    <span className="font-medium">Email:</span><br />
                                    {user?.email}
                                </p>
                                <p className="text-sm mb-2">
                                    <span className="font-medium">Teléfono:</span><br />
                                    {user?.phone}
                                </p>
                                <p className="text-sm mb-2">
                                    <span className="font-medium">RFC:</span><br />
                                    {user?.rfc || 'No especificado'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row">

                            <div className="card p-4 mb-4 w-full md:w-[47%]">
                                <h5 className="font-semibold mb-2">Dirección de instalación</h5>
                                {selectedAddress ? (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                        <p className="font-medium">{selectedAddress.name}</p>
                                        <p className="text-sm">{selectedAddress.street} #{selectedAddress.number}</p>
                                        <p className="text-sm">{selectedAddress.city}, {selectedAddress.state}</p>
                                        <p className="text-sm">CP: {selectedAddress.zipCode}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No se ha seleccionado dirección</p>
                                )}
                            </div>



                            <div className="card p-4 mb-4 w-full md:w-[47%]">
                                <h5 className="font-semibold mb-2">Paquete contratado</h5>
                                {selectedPackage ? (
                                    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                                        <h6 className="font-bold text-lg">{selectedPackage.name}</h6>
                                        <p className="text-xl font-bold text-green-600 my-2">
                                            ${selectedPackage.totalAmount}/mes
                                        </p>
                                        <div className="text-sm">
                                            <p className="flex items-center mb-1">
                                                <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                {selectedPackage.channelPackage.channels.length} canales
                                            </p>
                                            <p className="flex items-center mb-1">
                                                <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                {selectedPackage.speed} Mbps de velocidad
                                            </p>
                                            <p className="flex items-center">
                                                <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                Instalación incluida
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No se ha seleccionado paquete</p>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            label="Atrás"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
                            label="Confirmar contrato"
                            icon="pi pi-check"
                            iconPos="right"
                            className="bg-green-600 py-1 px-2 text-white border-green-600 hover:bg-green-700"
                            disabled={!selectedAddressId || !selectedPackageId}
                            onClick={handleConfirmContract}
                        />
                    </div>
                </StepperPanel>
            </Stepper>
        </Dialog>
    );
};