import React from 'react'

import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";

// Esto es para el formulario
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CategoryService } from '../../../../services/CategoryService';

export const CategoryModal = ({ visibleD, setVisibleD }) => {

    // Esto es para el formulario
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre de la categoría es obligatorio")
            .matches(
                // Regex de solo letras y números
                /^[a-zA-Z\s]*$/,
                "El nombre de la categoría no es válida"
            )

    });

    // Esto es para el formulario
    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('Datos del formulario:', values);
            
            // Cerrar el modal
            const response = await CategoryService.saveCategory(values.name);
            console.log(response);
            formik.resetForm();
            setVisibleD(false);
        },
    });

    // Handler para cambios en los inputs
    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    return (
        <Dialog header="Registrar categoría" visible={visibleD} className='w-full md:w-[30vw]' onHide={() => { if (!visibleD) return; setVisibleD(false); }}>
            <form onSubmit={formik.handleSubmit}>
                {/* Campo name */}
                <div className='mt-6'>
                    <FloatLabel className='w-full'>
                        <InputText
                            id="name"
                            name="name"
                            className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                            value={formik.values.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <label htmlFor="name">Nombre de la categoría</label>
                    </FloatLabel>
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className=" bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Registrar categoría
                    </button>
                </div>
            </form>
        </Dialog>
    )
}
