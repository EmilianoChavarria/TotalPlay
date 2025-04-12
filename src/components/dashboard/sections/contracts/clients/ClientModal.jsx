import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { ClientService } from '../../../../../services/ClientService';
import { showErrorAlert } from '../../../../CustomAlerts';
import { BaseFormModal } from '../../../../BaseFormModal';
import { DateField, TextField } from '../../../../TextField';
import { handleApiResponse } from '../../../../FormUtils';

// Client-specific configuration
const clientFormConfig = {
    initialValues: (isEditMode, clientToEdit) => ({
        name: isEditMode ? clientToEdit.name : '',
        lastName: isEditMode ? clientToEdit.lastName : '',
        surname: isEditMode ? clientToEdit.surname : '',
        rfc: isEditMode ? clientToEdit.rfc : '',
        email: isEditMode ? clientToEdit.email : '',
        phone: isEditMode ? clientToEdit.phone : '',
        birthdate: isEditMode && clientToEdit.birthdate ? new Date(clientToEdit.birthdate) : null,
    }),

    validationSchema: Yup.object().shape({
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
    }),

    prepareData: (values) => ({
        ...values,
        birthdate: values.birthdate ? moment(values.birthdate).format('YYYY-MM-DD') : null
    }),

    submitRequest: (data, isEditMode, entityId) =>
        isEditMode
            ? ClientService.updateClient({ id: entityId, ...data, status: true })
            : ClientService.saveClient(data),

    entityName: 'cliente'
};

export const ClientModal = ({ visible, setVisible, onSuccess, clientToEdit }) => {
    const isEditMode = !!clientToEdit;

    const handleSubmit = async (values, formik) => {
        try {
            const data = clientFormConfig.prepareData(values);
            console.log("Submitting data:", data); // Debugging line
            const response = await clientFormConfig.submitRequest(
                data,
                isEditMode,
                clientToEdit?.userId
            );
            console.log("API response:", response); // Debugging line

            handleApiResponse(
                response,
                isEditMode,
                setVisible,
                formik,
                onSuccess,
                clientFormConfig.entityName
            );
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <BaseFormModal
            visible={visible}
            setVisible={setVisible}
            title={isEditMode ? "Editar cliente" : "Registrar cliente"}
            initialValues={clientFormConfig.initialValues(isEditMode, clientToEdit)}
            validationSchema={clientFormConfig.validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
        >
            {(formik) => (
                <div className="mt-8">
                    <div className="w-full">
                        <TextField formik={formik} fieldName="name" label="Nombre" />
                    </div>
                    <div className='w-full flex flex-col justify-between items-start md:flex-row'>

                        <div className="w-full md:w-[47%]">
                            <TextField formik={formik} fieldName="lastName" label="Apellido paterno" />
                        </div>

                        <div className="w-full md:w-[47%]">
                            <TextField formik={formik} fieldName="surname" label="Apellido materno" />
                        </div>
                    </div>

                    <div className="col-12 field">
                        <TextField formik={formik} fieldName="rfc" label="RFC" />
                    </div>

                    <div className="col-12 field">
                        <TextField formik={formik} fieldName="email" label="Correo" type="email" />
                    </div>
                    <div className='w-full flex flex-col justify-between items-start md:flex-row'>
                        <div className="w-full md:w-[47%]">
                            <TextField formik={formik} fieldName="phone" label="Teléfono" />
                        </div>

                        <div className="w-full md:w-[47%] ">
                            <DateField formik={formik} fieldName="birthdate" label="Fecha de nacimiento" />
                        </div>
                    </div>
                </div>
            )}
        </BaseFormModal>
    );
};



const handleApiError = (error) => {
    console.error("Error:", error);
    showErrorAlert('Ocurrió un error al procesar la solicitud');
};