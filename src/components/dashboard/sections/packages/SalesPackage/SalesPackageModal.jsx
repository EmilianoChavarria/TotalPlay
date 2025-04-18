import { Dialog } from 'primereact/dialog';
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { ChannelPackageService } from '../../../../../services/ChannelPackageService';
import { SalesPackageService } from '../../../../../services/SalesPackageService';
import { showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';

export const SalesPackageModal = ({ visible, setVisible, onSuccess }) => {


    const [channelPackages, setChannelPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const fetchChannelPackages = async () => {
        try {
            const response = await ChannelPackageService.getAllChannelPackages();
            const disponibles = response.data.filter(pkg => pkg.status === 'DISPONIBLE');
            setChannelPackages(disponibles);
        } catch (error) {
            console.log(error);
        }
    }
    

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El nombre del paquete no es válido"),
        totalAmount: Yup.number()
            .typeError("El precio debe ser un número")
            .required("El precio es obligatoria"),
        speed: Yup.number()
            .typeError('La velocidad de internet no es válida')
            .required("La velocidad de internet es obligatorio")
            .min(1, "La velocidad de internet no es válida")
        ,
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            totalAmount: '',
            speed: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = {
                ...values,
                channel_package_name: selectedPackage.name
            };
            console.log('Datos del formulario:', formData);

            try {
                const response = await SalesPackageService.saveChannel(formData);
                console.log("Respuesta del servidor:", response);

                if (response.status === 'CREATED' || response.success) {
                    setVisible(false);
                    formik.resetForm();
                    showSuccessAlert(response.message || 'Paquete creado exitosamente', () => {
                        if (onSuccess) {
                            onSuccess();
                        }
                    });
                } else {
                    setVisible(false);
                    showErrorAlert(response.message || 'Ocurrió un error al crear el paquete', () => {
                        setVisible(true);
                    });
                }
            } catch (error) {
                console.log("Error al crear el paquete:", error);
                showErrorAlert('Ocurrió un error al procesar la solicitud');
            }
        },
    });

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };



    useEffect(() => {
        if (visible) {
            fetchChannelPackages();
        }

    }, [visible])

    return (
        <Dialog
            header="Agregar paquete de ventas"
            visible={visible}
            className="w-full md:w-[30vw] xl:w-[40vw] 2xl:w-[30vw]"
            onHide={() => visible && setVisible(false)}
        >
            <form onSubmit={formik.handleSubmit} className='mt-8'>
                <div className='mt-4'>
                    <FloatLabel className='w-full'>
                        <InputText
                            id="name"
                            name="name"
                            className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                            value={formik.values.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <label htmlFor="name">Nombre</label>
                    </FloatLabel>
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                    )}
                </div>

                <div className={`mt-4 flex flex-col md:flex-row justify-between items-start ${formik.touched.name && formik.errors.name ? 'mt-8' : 'mt-6'}`}>
                    <div className={`w-full md:w-[49%] `}>
                        <FloatLabel >
                            <InputText
                                id="totalAmount"
                                name="totalAmount"
                                className={`border ${formik.touched.totalAmount && formik.errors.totalAmount ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.totalAmount}
                                onChange={(e) => handleChange('totalAmount', e.target.value)}
                            />
                            <label htmlFor="totalAmount">Precio ($/mes)</label>
                        </FloatLabel>
                        {formik.touched.totalAmount && formik.errors.totalAmount && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.totalAmount}</div>
                        )}
                    </div>
                    <div className='flex items-center justify-start w-full md:w-[45%] '>
                        <div className='mr-2'>
                            <FloatLabel >
                                <InputText
                                    id="speed"
                                    name="speed"
                                    className={`border ${formik.touched.speed && formik.errors.speed ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                    value={formik.values.speed}
                                    onChange={(e) => handleChange('speed', e.target.value)}
                                />
                                <label htmlFor="speed">Velocidad de internet</label>
                            </FloatLabel>
                            {formik.touched.speed && formik.errors.speed && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.speed}</div>
                            )}
                        </div>
                        <span>mbs</span>
                    </div>

                </div>

                <div className='w-full mt-5 flex flex-col'>
                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-850">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package w-4 h-4" data-id="element-152">
                            <path d="m7.5 4.27 9 5.15"></path>
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                            <path d="m3.3 7 8.7 5 8.7-5"></path>
                            <path d="M12 22V12"></path>
                        </svg>
                        Selecciona un paquete de canales
                    </div>

                    <div className="space-y-3 mt-2">
                        {channelPackages.map(pkg => (
                            <div
                                key={pkg.id}
                                className={`border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-colors ${selectedPackage?.id === pkg.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedPackage(pkg)}
                            >
                                <div>
                                    <p className='text-lg font-semibold'>{pkg.name}</p>
                                    <p className='text-sm text-gray-600'>Incluye {pkg.channels.length} canales</p>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                <div className='mt-8'>
                    <button
                        type="submit"
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-200'
                        disabled={formik.isSubmitting || !formik.isValid || !selectedPackage}
                    >
                        {formik.isSubmitting ? 'Guardando...' : 'Registrar'}
                    </button>
                </div>
            </form>
        </Dialog>
    )
}