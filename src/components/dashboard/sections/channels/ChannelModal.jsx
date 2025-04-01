import React from 'react'
import { useState } from 'react';

import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";

// Esto es para el formulario
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CategoryModal } from './CategoryModal';

export const ChannelModal = ({ visible, setVisible }) => {

    const [visibleD, setVisibleD] = useState(false);

    // Esto es para el formulario
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre del canal es obligatorio")
            .matches(
                // Regex de solo letras y números
                /^[a-zA-Z0-9\s]*$/,
                "El nombre del canal no es válido"
            ),
        description: Yup.string()
            .required("La descripción del canal es obligatoria")
            .matches(
                // Regex de solo letras y números
                /^[a-zA-Z0-9\s]*$/,
                "La descripción del canal no es válida"
            ),
        number: Yup.number()
            .typeError('El número del canal no es válido')
            .required("El número del canal es obligatorio")
            .min(1, "El número del canal no es válido")

        ,
        category: Yup.string()
            .required("La categoría del canal es obligatoria")
            .matches(
                // Regex de solo letras
                /^[a-zA-Z\s]*$/,
                "La categoría del canal no es válida"
            ),
        // Aqui va un logo de tipo file
        logo: Yup.mixed()
            .required("El logo del canal es obligatorio")
            .test(
                "fileSize",
                "El archivo es muy grande (máx. 2MB)",
                (value) => {
                    if (!value) return true; // Si no hay archivo, la validación required se encargará
                    return value.size <= 2000000;
                }
            )
            .test(
                "fileFormat",
                "Solo se permiten imágenes (JPEG, PNG, JPG)",
                (value) => {
                    if (!value) return true; // Si no hay archivo, la validación required se encargará
                    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
                }
            )

    });

    // Datos para el AutoComplete
    const categories = [
        'Deportes',
        'Noticias',
        'Entretenimiento',
        'Películas',
        'Series',
        'Infantil',
        'Música',
        'Cultural',
        'Educativo',
        'Documentales',
        'Telenovelas',
        'Reality Shows',
        'Cocina',
        'Viajes',
        'Tecnología'
    ];

    const [filteredCategories, setFilteredCategories] = useState([]);

    const searchCategory = (event) => {
        setTimeout(() => {
            let filtered;
            if (!event.query.trim().length) {
                filtered = [...categories];
            } else {
                filtered = categories.filter((category) => {
                    return category.toLowerCase().includes(event.query.toLowerCase());
                });
            }
            setFilteredCategories(filtered);
        }, 250);
    };

    // TODO: Implementar la lógica para subir la imagen
    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        // Resetear errores previos
        formik.setFieldError('logo', undefined);

        if (!file) {
            formik.setFieldValue('logo', null);
            setPreviewImage(null);
            return;
        }

        // Validar tipo de archivo primero
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            formik.setFieldError('logo', 'Formato de imagen no válido');
            formik.setFieldTouched('logo', true, false);
            event.target.value = ''; // Limpiar el input file
            return;
        }

        // Validar tamaño
        if (file.size > 2000000) {
            formik.setFieldError('logo', 'La imagen es demasiado grande');
            formik.setFieldTouched('logo', true, false);
            event.target.value = ''; // Limpiar el input file
            return;
        }

        // Si pasa las validaciones, procesar la imagen
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            formik.setFieldValue('logo', file);
            formik.setFieldTouched('logo', true, false);
        };
        reader.readAsDataURL(file);
    };

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            number: '',
            category: '',
            logo: ''
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('Datos del formulario:', values);
            // navigate('/dashboard/home');
        },
    });

    // Handler para cambios en los inputs
    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    return (
        <>

            <Dialog header="Agregar canal" visible={visible} className='w-full md:w-[40vw]' onHide={() => { if (!visible) return; setVisible(false); }}>
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
                            <label htmlFor="name">Nombre del canal</label>
                        </FloatLabel>
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                        )}
                    </div>

                    {/* Campo description */}
                    <div className={`${formik.touched.name && formik.errors.name ? 'mt-8' : 'mt-6'}`}>
                        <FloatLabel className='w-full'>
                            <InputTextarea
                                id="description"
                                name="description"
                                className={`border ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'} pl-4 w-full`}
                                value={formik.values.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3} cols={30}
                            />
                            <label htmlFor="description">Descripción del canal</label>
                        </FloatLabel>
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
                        )}
                    </div>

                    {/* Campo number */}
                    <div className={`${formik.touched.description && formik.errors.description ? 'mt-8' : 'mt-6'}`}>
                        <FloatLabel className='w-full'>
                            <InputText
                                id="number"
                                name="number"
                                className={`border ${formik.touched.number && formik.errors.number ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.number}
                                onChange={(e) => handleChange('number', e.target.value)}
                            />
                            <label htmlFor="number">Número del canal</label>
                        </FloatLabel>
                        {formik.touched.number && formik.errors.number && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.number}</div>
                        )}
                    </div>

                    {/* Campo category con AutoComplete */}
                    <div className={`${formik.touched.number && formik.errors.number ? 'mt-8' : 'mt-8'}`}>
                        <div className='flex justify-between items-center w-full'>
                            <FloatLabel className='w-[80%] md:w-[65%]'>
                                <AutoComplete
                                    inputId="category"
                                    name="category"
                                    value={formik.values.category}
                                    suggestions={filteredCategories}
                                    completeMethod={searchCategory}
                                    onChange={(e) => handleChange('category', e.value)}
                                    className={`w-full border rounded-lg ${formik.touched.category && formik.errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                    inputClassName="w-full min-h-10 pl-4"
                                    dropdown
                                />
                                <label htmlFor="category">Categoría del canal</label>
                            </FloatLabel>
                            <button type='button' className='flex min-h-10 items-center rounded-lg justify-center md:hidden bg-blue-500 text-white px-3 py-2 whitespace-nowrap'>
                                <i className={`pi pi-plus `} style={{ fontSize: '1.2rem' }} />
                            </button>
                            <button type='button' onClick={() => setVisibleD(true)} className='hidden rounded-lg md:block bg-blue-500 text-white px-3 py-2 whitespace-nowrap'>Registrar nueva</button>

                        </div>
                        {formik.touched.category && formik.errors.category && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.category}</div>
                        )}
                    </div>

                    {/*TODO: Campo logo (imagen) */}
                    <div className={`${formik.touched.category && formik.errors.category ? 'mt-8' : 'mt-6'}`}>
                        <label className="block text-xs font-medium text-gray-500 mb-1 ml-4">
                            Logo del canal
                        </label>



                        <div className={`border rounded-lg  p-2 ${formik.touched.logo && formik.errors.logo
                            ? 'border-red-500'
                            : 'border-gray-300'
                            }`}>
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:cursor-pointer cursor-pointer
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
                            />

                            {/* Previsualización */}
                            {previewImage ? (
                                <div className="mt-3 ml-3 flex items-center gap-4">
                                    <img
                                        src={previewImage}
                                        alt="Previsualización"
                                        className="h-20 w-20 object-contain "
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewImage(null);
                                            formik.setFieldValue('logo', null);
                                            document.getElementById('logo').value = '';
                                        }}
                                        className="text-red-500 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ) : null}


                        </div>
                        <p className="text-xs px-2 text-gray-500 mt-2">
                            Formatos aceptados: JPG, PNG (Máx. 2MB)
                        </p>

                        {formik.touched.logo && formik.errors.logo && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.logo}</div>
                        )}
                    </div>

                    {/* Botón de envío */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                        >
                            Guardar Canal
                        </button>
                    </div>

                </form>
            </Dialog>

            {/* Modal de form para agregar canal */}
            <CategoryModal
                visibleD={visibleD}
                setVisibleD={setVisibleD}
            />
        </>
    )
}
