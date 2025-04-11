import { Dialog } from 'primereact/dialog';
import React from 'react'
import moment from 'moment';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { ClientService } from '../../../../../services/ClientService';
import { showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';



export const ClientModal = ({ visible, setVisible, onSuccess }) => {

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


                    const firstFour = value.substring(0, 4);
                    const birthDate = value.substring(4, 10);
                    const remaining = value.substring(10);


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
            const data = {
                ...values,
                birthdate: values.birthdate
                    ? moment(values.birthdate).format('YYYY-MM-DD')
                    : null
            };

            console.log('Datos formateados:', data);

            try {
                const response = await ClientService.saveClient(data);
                console.log("Respuesta del servidor:", response);
        
                if (response.status === 'OK' || response.success) {
                    setVisible(false);
                    formik.resetForm();
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
                            value={formik.values.birthdate ? new Date(formik.values.birthdate) : null}
                            onChange={(e) => handleChange('birthdate', e.target.value)}
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
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {formik.isSubmitting ? 'Iniciando sesión...' : 'Login'}
                    </button>
                </div>
            </form>

        </Dialog>
    )
}
