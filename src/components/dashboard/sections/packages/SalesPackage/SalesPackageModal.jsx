import { Dialog } from 'primereact/dialog';
import React from 'react'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';

export const SalesPackageModal = ({ visible, setVisible }) => {


    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre es obligatorio"),
        // .matches(
        //     /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        //     "El correo no es válido"
        // ),
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
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('Datos del formulario:', values);
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
                    {/* Campo de nombre */}
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

                    {/* Campo de precio */}
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

                <div className='mt-8'>
                    <button
                        type="submit"
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-200'
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {formik.isSubmitting ? 'Iniciando sesión...' : 'Login'}
                    </button>
                </div>
            </form>
        </Dialog>
    )
}
