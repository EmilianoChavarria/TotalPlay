import { Dialog } from 'primereact/dialog';
import React from 'react'
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';

export const SalesPackageModal = ({ visible, setVisible }) => {
    // Estado para los paquetes disponibles
    const [availablePackages] = useState([
        {
            id: 1,
            name: "Premium Package",
            description: "150 Channels • 1000 Mbps",
            price: "$99.99/month"
        },
        {
            id: 2,
            name: "Basic Package",
            description: "50 Channels • 200 Mbps",
            price: "$49.99/month"
        },
        {
            id: 3,
            name: "Sports Package",
            description: "80 Channels • 500 Mbps",
            price: "$69.99/month"
        },
        {
            id: 4,
            name: "Family Package",
            description: "100 Channels • 300 Mbps",
            price: "$79.99/month"
        }
    ]);

    const [selectedPackage, setSelectedPackage] = useState(null);

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre es obligatorio"),
        totalAmount: Yup.number()
            .typeError("El precio debe ser un número")
            .required("El precio es obligatoria"),
        product_name: Yup.string()
            .required("El nombre del producto es obligatorio"),
    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            totalAmount: '',
            product_name: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = {
                ...values,
                selectedPackage
            };
            console.log('Datos del formulario:', formData);
        },
    });

    // Handler para cambios en los inputs
    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    return (
        <Dialog header="Agregar paquete de ventas" visible={visible} className='w-full md:w-[30vw] xl:w-[40vw] 2xl:w-[30vw]' onHide={() => { if (!visible) return; setVisible(false); }}>
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

                <div className='mt-4 flex flex-col md:flex-row justify-between items-start'>
                    {/* Campo de precio */}
                    <div className='w-full md:w-[49%]'>
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

                    {/* Campo de nombre del producto */}
                    <div className='w-full md:w-[49%]'>
                        <FloatLabel >
                            <InputText
                                id="product_name"
                                name="product_name"
                                className={`border ${formik.touched.product_name && formik.errors.product_name ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.product_name}
                                onChange={(e) => handleChange('product_name', e.target.value)}
                            />
                            <label htmlFor="product_name">Nombre del producto</label>
                        </FloatLabel>
                        {formik.touched.product_name && formik.errors.product_name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.product_name}</div>
                        )}
                    </div>
                </div>

                {/* Sección de elegir paquetes */}
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
                    
                    {/* Lista de paquetes */}
                    <div className="space-y-3 mt-2">
                        {availablePackages.map(pkg => (
                            <div 
                                key={pkg.id} 
                                className={`border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-colors ${
                                    selectedPackage?.id === pkg.id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => setSelectedPackage(pkg)}
                            >
                                <div>
                                    <p className='text-lg font-semibold'>{pkg.name}</p>
                                    <p className='text-sm text-gray-600'>{pkg.description}</p>
                                </div>
                                <div>
                                    <span className='text-xl text-blue-600 font-semibold'>{pkg.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botón de guardar */}
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