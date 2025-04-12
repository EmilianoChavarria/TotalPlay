import { Dialog } from 'primereact/dialog';
import React from 'react'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { AddressService } from '../../../../../services/AddressService';
import { showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';

export const AddressModal = ({ visibleD, setVisibleD, user, onSuccess }) => {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El nombre no es válido"),
        street: Yup.string()
            .required("La calle es obligatoria")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+)*$/, "La calle no es válida"),
        number: Yup.string()
            .required("El numero de casa es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+)*$/, "El numero de casa es válido"),
        city: Yup.string()
            .required("La ciudad es obligatoria")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+)*$/, "La ciudad no es válida"),
        state: Yup.string()
            .required("El estado es obligatorio")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El estado no es válido"),
        zipCode: Yup.string()
            .required("El código postal es obligatorio")
            .matches(/^(?!00000$)\d{5}$/, "El código postal no es válido"),


    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            street: '',
            number: '',
            city: '',
            state: '',
            zipCode: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await AddressService.saveAddress({
                    ...values,
                    clientId: user.userId
                });

                if (response.status === 'OK') {
                    setVisibleD(false); 
                    formik.resetForm();
                    showSuccessAlert('Dirección creada', () => {
                        if (onSuccess) {
                            onSuccess();
                        }
                    });
                }
            } catch (error) {
                showErrorAlert('Error al guardar');
            }
        }
    });

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    return (
        <Dialog
            header={`Registrar dirección para el cliente: ${user?.name} ${user?.lastName}`}
            visible={visibleD}
            className='w-full md:w-[30vw] xl:w-[40vw] 2xl:w-[30vw]'
            onHide={() => {
                if (!visibleD) {
                    return;
                }
                setVisibleD(false);
            }}
        >
            <form onSubmit={formik.handleSubmit} className='mt-8'>
                <div className={`mt-4 w-full flex flex-col justify-between items-start md:flex-row`}>
                    <div className='w-full md:w-[49%]'>
                        <FloatLabel >
                            <InputText
                                id="name"
                                name="name"
                                className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                            <label htmlFor="name">Nombre identificador</label>
                        </FloatLabel>
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                        )}
                    </div>
                    <div className='w-full md:w-[49%]'>
                        <FloatLabel >
                            <InputText
                                id="street"
                                name="street"
                                className={`border ${formik.touched.street && formik.errors.street ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.street}
                                onChange={(e) => handleChange('street', e.target.value)}
                            />
                            <label htmlFor="street">Calle</label>
                        </FloatLabel>
                        {formik.touched.street && formik.errors.street && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.street}</div>
                        )}
                    </div>
                </div>

                <div className={`${formik.touched.street && formik.errors.street ? 'mt-8' : 'mt-7'} w-full flex flex-col justify-between items-start md:flex-row`}>
                    <div className='w-full md:w-[49%]'>
                        <FloatLabel >
                            <InputText
                                id="number"
                                name="number"
                                className={`border ${formik.touched.number && formik.errors.number ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.number}
                                onChange={(e) => handleChange('number', e.target.value)}
                            />
                            <label htmlFor="number">Numero de casa</label>
                        </FloatLabel>
                        {formik.touched.number && formik.errors.number && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.number}</div>
                        )}
                    </div>
                    <div className='w-full md:w-[49%]'>
                        <FloatLabel >
                            <InputText
                                id="city"
                                name="city"
                                className={`border ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                            <label htmlFor="city">Ciudad</label>
                        </FloatLabel>
                        {formik.touched.city && formik.errors.city && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
                        )}
                    </div>
                </div>
                <div className={`${formik.touched.city && formik.errors.city ? 'mt-8' : 'mt-7'} w-full flex flex-col justify-between items-start md:flex-row`}>
                    <div className='w-full md:w-[49%]'>
                        <FloatLabel >
                            <InputText
                                id="state"
                                name="state"
                                className={`border ${formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                            />
                            <label htmlFor="state">Estado</label>
                        </FloatLabel>
                        {formik.touched.state && formik.errors.state && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.state}</div>
                        )}
                    </div>
                    <div className='w-full md:w-[49%]'>
                        <FloatLabel >
                            <InputText
                                id="zipCode"
                                name="zipCode"
                                className={`border ${formik.touched.zipCode && formik.errors.zipCode ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.zipCode}
                                onChange={(e) => handleChange('zipCode', e.target.value)}
                            />
                            <label htmlFor="zipCode">Código Postal</label>
                        </FloatLabel>
                        {formik.touched.zipCode && formik.errors.zipCode && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.zipCode}</div>
                        )}
                    </div>
                </div>




                <div className='mt-8'>
                    <button
                        type="submit"
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-200'
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {formik.isSubmitting ? 'Agregando...' : 'Agregar dirección'}
                    </button>
                </div>
            </form>
        </Dialog >
    )
}
