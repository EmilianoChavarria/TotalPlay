import { Dialog } from 'primereact/dialog';
import React, { useEffect } from 'react'
import moment from 'moment';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { ClientService } from '../../../../../services/ClientService';
import { showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';



export const ClientModal = ({ visible, setVisible, onSuccess, clientToEdit }) => {
    const isEditMode = !!clientToEdit;
    console.log("clientToEdit", clientToEdit)

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El nombre no es válido"),
        lastName: Yup.string()
            .required("El apellido paterno es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El apellido paterno no es válido"),
        surname: Yup.string()
            .required("El apellido materno es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El apellido materno no es válido"),
        rfc: Yup.string()
            .required("El RFC es obligatorio")
            .matches(
                /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/,
                "El RFC no tiene un formato válido. Ejemplo: QUCA470929CL7"
            )
            .test(
                'rfc-structure',
                'El RFC no coincide con la estructura oficial',
                value => {
                    if (!value) return false;
                    const birthDate = value.substring(4, 10);
                    const basicStructure = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/.test(value);


                    const year = parseInt(birthDate.substring(0, 2)),
                        month = parseInt(birthDate.substring(2, 4)) - 1,
                        day = parseInt(birthDate.substring(4, 6))

                    const dateValid = (month >= 0 && month <= 11) &&
                        (day > 0 && day <= 31) &&
                        (year >= 0 && year <= 99);

                    return basicStructure && dateValid;
                }
            ),
        email: Yup.string()
            .required("El correo es obligatorio")
            .matches(
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                "El correo no es válido"
            ),
        phone: Yup.string()
            .required("El teléfono es obligatorio")
            .matches(/^\d{10}$/, "El teléfono no es válido"),
        birthdate: Yup.string()
            .required("La fecha de nacimiento es obligatoria")

    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            name: isEditMode ? clientToEdit.name : '',
            lastName: isEditMode ? clientToEdit.lastName : '',
            surname: isEditMode ? clientToEdit.surname : '',
            rfc: isEditMode ? clientToEdit.rfc : '',
            email: isEditMode ? clientToEdit.email : '',
            phone: isEditMode ? clientToEdit.phone : '',
            birthdate: isEditMode && clientToEdit.birthdate ? new Date(clientToEdit.birthdate) : null,
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('Valores del formulario ANTES de procesar:', values);

            const data = {
                ...values,
                birthdate: values.birthdate
                    ? moment(values.birthdate).format('YYYY-MM-DD')
                    : null
            };
            console.log("data", data)

            try {
                let response;
                if (isEditMode) {
                    response = await ClientService.updateClient(({
                        id: clientToEdit.userId, 
                        ...data 
                        , status: true
                    }));
                } else {
                    
                    response = await ClientService.saveClient(data);
                }

                if (response.status === 'OK' || response.success) {
                    setVisible(false);
                    formik.resetForm();
                    showSuccessAlert(response.message ||
                        (isEditMode ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente'),
                        () => {
                            if (onSuccess) onSuccess();
                        }
                    );
                } else {
                    showErrorAlert(response.message ||
                        (isEditMode ? 'Error al actualizar el cliente' : 'Error al crear el cliente')
                    );
                }
            } catch (error) {
                console.error("Error:", error);
                showErrorAlert('Ocurrió un error al procesar la solicitud');
            }
        }
    });

    // Handler para cambios en los inputs
    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log('Formulario enviado - valores:', formik.values);
        await formik.submitForm();
    };

    useEffect(() => {
        if (isEditMode && clientToEdit) {
            formik.setValues({
                name: clientToEdit.name,
                lastName: clientToEdit.lastName,
                surname: clientToEdit.surname,
                rfc: clientToEdit.rfc,
                email: clientToEdit.email,
                phone: clientToEdit.phone,
                birthdate: clientToEdit.birthdate ? new Date(clientToEdit.birthdate) : null
            });
        }
    }, [clientToEdit, isEditMode]);

    return (
        <Dialog
            header={isEditMode ? "Editar cliente" : "Registrar cliente"}
            visible={visible}
            className="w-full md:w-[30vw] xl:w-[40vw] 2xl:w-[30vw]"
            onHide={() => {
                setVisible(false);
                formik.resetForm();
            }}
        >

            <form onSubmit={handleFormSubmit} className='mt-8'>
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

                <div className={`${formik.touched.name && formik.errors.name ? 'mt-8' : 'mt-7'} w-full flex flex-col justify-between items-start md:flex-row`}>
                    <div className='w-full md:w-[47%]'>
                        <FloatLabel >
                            <InputText
                                id="lastName"
                                name="lastName"
                                className={`border ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                            />
                            <label htmlFor="lastName">Apellido paterno</label>
                        </FloatLabel>
                        {formik.touched.lastName && formik.errors.lastName && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
                        )}
                    </div>
                    <div className='w-full md:w-[47%]'>
                        <FloatLabel >
                            <InputText
                                id="surname"
                                name="surname"
                                className={`border ${formik.touched.surname && formik.errors.surname ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.surname}
                                onChange={(e) => handleChange('surname', e.target.value)}
                            />
                            <label htmlFor="surname">Apellido materno</label>
                        </FloatLabel>
                        {formik.touched.surname && formik.errors.surname && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.surname}</div>
                        )}
                    </div>
                </div>

                <div className={`${formik.touched.surname && formik.errors.surname ? 'mt-8' : 'mt-7'}`}>
                    <FloatLabel className='w-full'>
                        <InputText
                            id="rfc"
                            name="rfc"
                            className={`border ${formik.touched.rfc && formik.errors.rfc ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                            value={formik.values.rfc}
                            onChange={(e) => handleChange('rfc', e.target.value)}
                        />
                        <label htmlFor="rfc">RFC</label>
                    </FloatLabel>
                    {formik.touched.rfc && formik.errors.rfc && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.rfc}</div>
                    )}
                </div>

                <div className={`${formik.touched.rfc && formik.errors.rfc ? 'mt-8' : 'mt-7'}`}>
                    <FloatLabel className='w-full'>
                        <InputText
                            id="email"
                            name="email"
                            className={`border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                            value={formik.values.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        <label htmlFor="email">Correo</label>
                    </FloatLabel>
                    {formik.touched.email && formik.errors.email && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                    )}
                </div>

                <div className={`${formik.touched.email && formik.errors.email ? 'mt-8' : 'mt-7'} flex flex-col justify-between items-start md:flex-row`}>

                    <div className='w-full md:w-[47%]'>
                        <FloatLabel className='w-full'>
                            <InputText
                                id="phone"
                                name="phone"
                                className={`border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                            <label htmlFor="phone">Número de teléfono</label>
                        </FloatLabel>
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                        )}
                    </div>
                    <div className='w-full md:w-[47%]'>
                        <FloatLabel className='w-full rounded-md'>
                            <Calendar
                                id="birthdate"
                                name="birthdate"
                                value={formik.values.birthdate}
                                onChange={(e) => {
                                    console.log('Fecha seleccionada:', e.value);
                                    handleChange('birthdate', e.value);
                                }}
                                className={`border ${formik.touched.birthdate && formik.errors.birthdate ? 'border-red-500' : 'border-gray-300'}min-h-10 h-10 pl-4 w-full rounded-md`}
                                dateFormat="yy/mm/dd"
                            // showIcon
                            />
                            <label htmlFor="birthdate">Fecha de nacimiento</label>
                        </FloatLabel>
                        {formik.touched.birthdate && formik.errors.birthdate && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.birthdate}</div>
                        )}
                    </div>
                </div>


                <div className='mt-8'>
                    <button
                        type="submit"
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-200'
                    >
                        {formik.isSubmitting ? 'Procesando...' : isEditMode ? 'Actualizar' : 'Registrar'}
                    </button>
                </div>
            </form>

        </Dialog>
    )
}
