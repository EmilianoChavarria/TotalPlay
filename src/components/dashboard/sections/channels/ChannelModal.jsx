import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CategoryModal } from './CategoryModal';
import { ChannelService } from '../../../../services/ChannelService';
import { CategoryService } from '../../../../services/CategoryService';
import Swal from 'sweetalert2';

// Helper function for field classes
const getFieldClasses = (fieldName, formik, fieldType = 'input') => {
    const baseClasses = {
        input: 'min-h-10 pl-4 w-full border',
        textarea: 'pl-4 w-full border',
        autocomplete: 'w-full border rounded-lg'
    };

    const errorClasses = formik.touched[fieldName] && formik.errors[fieldName]
        ? 'border-red-500'
        : 'border-gray-300';

    return `${baseClasses[fieldType]} ${errorClasses}`;
};

// Extracted validation schema
const getValidationSchema = () => Yup.object().shape({
    name: Yup.string()
        .required("El nombre del canal es obligatorio")
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+)*$/, "El nombre del canal no es válido"),
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
    logo: Yup.string().required("El logo del canal es obligatorio")
});

// Extracted form submission handler
const handleFormSubmit = async (values, channelToEdit, onSuccess, setVisible, formik) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('number', values.number.toString());
    formData.append('categoryId', values.category.id.toString());

    if (values.logo instanceof File) {
        formData.append('image', values.logo);
    } else if (channelToEdit && !(values.logo instanceof File)) {
        formData.append('keepImage', 'true');
    }
    

    try {
        let response;
        if (channelToEdit) {
            formData.append('id', channelToEdit.id.toString());
            response = await ChannelService.updateChannel(channelToEdit.id, formData);
        } else {
            response = await ChannelService.saveChannel(formData);
        }

        handleApiResponse(response, setVisible, formik, onSuccess);
    } catch (error) {
        handleApiError(error);
    }
};

const handleApiResponse = (response, setVisible, formik, onSuccess) => {
    if (response.status === 'OK') {
        setVisible(false);
        formik.resetForm();
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: response.message,
        });
        onSuccess?.();
    } else {
        setVisible(false);
        Swal.fire({
            icon: 'error',
            title: 'Error, inténtelo nuevamente',
            text: response.message || 'Hubo un problema al guardar el canal',
        }).then(() => setVisible(true));
    }
};

// Extracted error handler
const handleApiError = (error) => {
    console.error("Error al crear/actualizar el canal:", error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema de conexión o del servidor',
    });
};

// Extracted image validation
const validateImage = (file, formik, event) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        formik.setFieldError('logo', 'Formato de imagen no válido');
        return false;
    }

    if (file.size > 2000000) {
        formik.setFieldError('logo', 'La imagen es demasiado grande');
        event.target.value = '';
        return false;
    }

    return true;
};

export const ChannelModal = ({ visible, setVisible, onSuccess, channelToEdit }) => {
    const [visibleD, setVisibleD] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            number: '',
            category: null,
            logo: null
        },
        validationSchema: getValidationSchema(),
        onSubmit: (values) => handleFormSubmit(values, channelToEdit, onSuccess, setVisible, formik)
    });

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await CategoryService.getCategories();
            setCategories(response.data && Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchCategories();
            if (channelToEdit) {
                loadChannelData(channelToEdit, formik, setPreviewImage);
            }
        } else {
            formik.resetForm();
            setPreviewImage(null);
        }
    }, [visible, channelToEdit]);

    const loadChannelData = (channel, formik, setPreviewImage) => {
        formik.setValues({
            name: channel.name,
            description: channel.description,
            number: channel.number,
            category: channel.category,
            logo: channel.logoBean?.image ? `data:image/jpeg;base64,${channel.logoBean.image}` : null
        });
        if (channel.logoBean?.image) {
            setPreviewImage(`data:image/jpeg;base64,${channel.logoBean.image}`);
        }
    };

    const handleCategoryModalClose = () => {
        setVisibleD(false);
        fetchCategories();
    };

    const searchCategory = (event) => {
        setTimeout(() => {
            const filtered = !event.query.trim().length
                ? [...categories]
                : categories.filter(category =>
                    category.name.toLowerCase().includes(event.query.toLowerCase()));
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

        if (!validateImage(file, formik, event)) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            const header = uint8Array.slice(0, 4).join(',');

            if (!header.startsWith('255,216,255,224') && !header.startsWith('137,80,78,71')) {
                formik.setFieldError('logo', 'El archivo no es una imagen válida');
                event.target.value = '';
                return;
            }

            setPreviewImage(URL.createObjectURL(file));
            formik.setFieldValue('logo', file);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    const itemTemplate = (item) => (
        <div className="flex align-items-center">
            <div>{item.name}</div>
        </div>
    );

    return (
        <>
            <Dialog
                header={channelToEdit ? "Editar canal" : "Agregar canal"}
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
                                className={getFieldClasses('name', formik)}
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
                                className={getFieldClasses('description', formik, 'textarea')}
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
                                className={getFieldClasses('number', formik)}
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
                                    className={getFieldClasses('category', formik, 'autocomplete')}
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