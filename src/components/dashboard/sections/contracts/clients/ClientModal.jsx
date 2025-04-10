import { Dialog } from 'primereact/dialog';
import React from 'react'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';

export const ClientModal = ({ visible, setVisible }) => {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/, "El nombre no es válido"),
        lastName: Yup.string()
            .required("El apellido paterno es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/, "El apellido paterno no es válido"),
        surname: Yup.string()
            .required("El apellido materno es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/, "El apellido materno no es válido"),
        rfc: Yup.string()
            .required("El rfc es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/, "El rfc no es válido"),
        email: Yup.string()
            .required("El correo es obligatorio")
            .matches(
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                "El correo no es válido"
            ),
        phone: Yup.string()
            .required("El teléfono es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/, "El teléfono no es válido"),
        birthdate: Yup.string()
            .required("La fecha de nacimiento es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/, "La fecha de nacimiento no es válido"),

    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            lastName: '',
            surname: '',
            rfc: '',
            email: '',
            phone: '',
            birthdate: '',
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
        <Dialog header="Registrar cliente" visible={visible} className='w-full md:w-[30vw] xl:w-[40vw] 2xl:w-[30vw]' onHide={() => { if (!visible) return; setVisible(false); }}>

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

                <div className={`${formik.touched.name && formik.errors.name ? 'mt-8' : 'mt-7'}`}>
                    <FloatLabel className='w-full'>
                        <InputText
                            id="name"
                            name="name"
                            className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                            value={formik.values.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <label htmlFor="name">Correo</label>
                    </FloatLabel>
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                    )}
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
