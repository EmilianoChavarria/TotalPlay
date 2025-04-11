import React, { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";

// Esto es para el formulario
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CategoryModal } from './CategoryModal';
import { ChannelService } from '../../../../services/ChannelService';
import { CategoryService } from '../../../../services/CategoryService';
import Swal from 'sweetalert2';

export const ChannelModal = ({ visible, setVisible, onSuccess  }) => {
    const [visibleD, setVisibleD] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Esquema de validación
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre del canal es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El nombre del canal no es válido")
        ,
        description: Yup.string()
            .required("La descripción del canal es obligatoria")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "La descripción del canal no es válida"),
        number: Yup.number()
            .typeError('El número del canal no es válido')
            .required("El número del canal es obligatorio")
            .min(1, "El número del canal no es válido"),
        category: Yup.object()
            .required("La categoría del canal es obligatoria")
            .shape({
                id: Yup.number().required(),
                name: Yup.string().required(),
                uuid: Yup.string().required(),
                status: Yup.boolean().required()
            }),
        logo: Yup.string()
            .required("El logo del canal es obligatorio")
        // .test("is-valid-image", "La imagen no es válida", (value) => {
        //     if (!value) return false;
        //     return value.startsWith('data:image');
        // })
    });

    // Obtener categorías del servicio
    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await CategoryService.getCategories();
            if (response.data && Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.error("Formato de datos inesperado:", response);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Cargar categorías al montar el componente y cuando se abre el modal
    useEffect(() => {
        if (visible) {
            fetchCategories();
        }
    }, [visible]);

    // Actualizar categorías cuando se cierra el modal de categoría
    const handleCategoryModalClose = () => {
        setVisibleD(false);
        fetchCategories(); // Refrescar las categorías después de agregar una nueva
    };

    // Búsqueda de categorías para el AutoComplete
    const searchCategory = (event) => {
        setTimeout(() => {
            let filtered;
            if (!event.query.trim().length) {
                filtered = [...categories];
            } else {
                filtered = categories.filter((category) => {
                    return category.name.toLowerCase().includes(event.query.toLowerCase());
                });
            }
            setFilteredCategories(filtered);
        }, 250);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        formik.setFieldError('logo', undefined);

        if (!file) {
            formik.setFieldValue('logo', null);
            setPreviewImage(null);
            return;
        }

        // Verificar el tipo MIME del archivo
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!validTypes.includes(file.type)) {
            console.log("Tipo de archivo no válido:", file.type);
            formik.setFieldError('logo', 'Formato de imagen no válido');
            return;
        }

        // Verificar el tamaño del archivo
        if (file.size > 2000000) { // 2MB
            formik.setFieldError('logo', 'La imagen es demasiado grande');
            event.target.value = '';
            return;
        }

        // Verificar la cabecera del archivo para asegurar que es realmente una imagen
        const reader = new FileReader();
        reader.onloadend = () => {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);

            // Comprobar si la cabecera del archivo corresponde a una imagen JPG o PNG
            const header = uint8Array.slice(0, 4).join(',');
            if (!header.startsWith('255,216,255,224') && !header.startsWith('137,80,78,71')) {
                formik.setFieldError('logo', 'El archivo no es una imagen válida');
                event.target.value = ''; // Limpiar el archivo seleccionado
                return;
            }

            setPreviewImage(URL.createObjectURL(file));
            formik.setFieldValue('logo', file);
        };
        reader.readAsArrayBuffer(file);
    };



    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            number: '',
            category: null,
            logo: null
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('number', values.number);
            formData.append('categoryId', values.category.id);
            formData.append('image', values.logo);

            try {
                const response = await ChannelService.saveChannel(formData);
                console.log("Respuesta del servidor:", response);

                if (response.status === 'OK') {
                    setVisible(false);
                    formik.resetForm();

                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: response.message,
                    });
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    setVisible(false);

                    Swal.fire({
                        icon: 'error',
                        title: 'Error, inténtelo nuevamente',
                        text: response.message || 'Hubo un problema al guardar el canal',
                    }).then(() => {
                        setVisible(true); 
                    });
                }


            } catch (error) {
                console.log("Error al crear el canal:", error);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema de conexión o del servidor',
                });
            }
        }



    });

    // Handler para cambios en los inputs
    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    // Función para mostrar el nombre de la categoría en el AutoComplete
    const itemTemplate = (item) => {
        return (
            <div className="flex align-items-center">
                <div>{item.name}</div>
            </div>
        );
    };

    return (
        <>
            <Dialog
                header="Agregar canal"
                visible={visible}
                className='w-full md:w-[40vw]'
                onHide={() => {
                    setVisible(false);
                    formik.resetForm();
                    setPreviewImage(null);
                }}
            >
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
                    <div className={`${formik.touched.number && formik.errors.number ? 'mt-8' : 'mt-6'}`}>
                        <div className='flex justify-between items-center w-full'>
                            <FloatLabel className='w-[80%] md:w-[65%]'>
                                <AutoComplete
                                    inputId="category"
                                    name="category"
                                    value={formik.values.category}
                                    suggestions={filteredCategories}
                                    completeMethod={searchCategory}
                                    onChange={(e) => handleChange('category', e.value)}
                                    field="name"
                                    itemTemplate={itemTemplate}
                                    className={`w-full border rounded-lg ${formik.touched.category && formik.errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                    inputClassName="w-full min-h-10 pl-4"
                                    dropdown
                                    loading={loadingCategories}
                                />
                                <label htmlFor="category">Categoría del canal</label>
                            </FloatLabel>
                            <button
                                type='button'
                                className='flex min-h-10 items-center rounded-lg justify-center md:hidden bg-blue-500 text-white px-3 py-2 whitespace-nowrap'
                                onClick={() => setVisibleD(true)}
                            >
                                <i className={`pi pi-plus`} style={{ fontSize: '1.2rem' }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => setVisibleD(true)}
                                className='hidden rounded-lg md:block bg-blue-500 text-white px-3 py-2 whitespace-nowrap'
                            >
                                Registrar nueva
                            </button>
                        </div>
                        {formik.touched.category && formik.errors.category && (
                            <div className="text-red-500 text-xs mt-1">Seleccione una categoría válida</div>
                        )}
                    </div>

                    {/* Campo logo */}
                    <div className={`${formik.touched.category && formik.errors.category ? 'mt-8' : 'mt-6'}`}>
                        <label className="block text-xs font-medium text-gray-500 mb-1 ml-4">
                            Logo del canal
                        </label>
                        <div className={`border rounded-lg p-2 ${formik.touched.logo && formik.errors.logo ? 'border-red-500' : 'border-gray-300'}`}>
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

                            {previewImage && (
                                <div className="mt-3 ml-3 flex items-center gap-4">
                                    <img
                                        src={previewImage}
                                        alt="Previsualización"
                                        className="h-20 w-20 object-contain"
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
                            )}
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
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? 'Guardando...' : 'Guardar Canal'}
                        </button>
                    </div>
                </form>
            </Dialog>

            {/* Modal para agregar nueva categoría */}
            <CategoryModal
                visibleD={visibleD}
                setVisibleD={handleCategoryModalClose}
            />
        </>
    )
}