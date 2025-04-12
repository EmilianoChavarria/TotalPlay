import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import * as Yup from 'yup';
import React from 'react';
import { Calendar } from 'primereact/calendar';
import { showErrorAlert, showSuccessAlert } from '../../../CustomAlerts';
import { ClientService } from '../../../../services/ClientService';
import moment from 'moment';

export const UserModal = ({ visible, setVisible, onSuccess, userToEdit }) => {
    const isEditMode = !!userToEdit;

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required("El nombre es obligatorio")
            .min(2, "Mínimo 2 caracteres")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El nombre no es válido"),
        lastName: Yup.string()
            .required("El apellido es obligatorio")
            .min(2, "Mínimo 2 caracteres")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El apellido no es válido"),
        surname: Yup.string()
            .required("El apellido es obligatorio")
            .min(2, "Mínimo 2 caracteres")
            .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+(?: [a-zA-ZÁÉÍÓÚáéíóúñÑ]+)*$/, "El apellido no es válido"),
        email: Yup.string()
            .required("El correo es obligatorio")
            .matches(
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                "El correo no es válido"
            ),
        password: isEditMode
            ? Yup.string()
                .notRequired()
                .min(8, "Mínimo 8 caracteres")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:;¿¡\-_+=#~()[\]{}|^<>/\\])[A-Za-z\d@$!%*?&.,:;¿¡\-_+=#~()[\]{}|^<>/\\]{8,}$/,
                    "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
                )
            : Yup.string()
                .required("La contraseña es obligatoria")
                .min(8, "Mínimo 8 caracteres")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:;¿¡\-_+=#~()[\]{}|^<>/\\])[A-Za-z\d@$!%*?&.,:;¿¡\-_+=#~()[\]{}|^<>/\\]{8,}$/,
                    "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
                ),
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
        phone: Yup.string()
            .required("El teléfono es obligatorio")
            .matches(/^\d{10}$/, "El teléfono no es válido"),
        birthdate: Yup.string()
            .required("La fecha de nacimiento es obligatoria")
    });

    const formik = useFormik({
        initialValues: {
            firstName: isEditMode ? userToEdit.firstName : '',
            lastName: isEditMode ? userToEdit.lastName : '',
            surname: isEditMode ? userToEdit.surname : '',
            rfc: isEditMode ? userToEdit.rfc : '',
            email: isEditMode ? userToEdit.email : '',
            password: '',
            phone: isEditMode ? userToEdit.phone : '',
            birthdate: isEditMode && userToEdit.birthdate ? new Date(userToEdit.birthdate) : null,
        },
        validationSchema,
        onSubmit: async (values) => {
            const data = {
                ...values,
                birthdate: values.birthdate
                    ? moment(values.birthdate).format('YYYY-MM-DD')
                    : null
            };

            if (isEditMode && !values.password) {
                delete data.password;
            }

            try {
                let response;
                if (isEditMode) {
                    response = await ClientService.editAgente({
                        id: userToEdit.id,
                        ...data
                    });
                } else {
                    response = await ClientService.saveAgente(data);
                }

                if (response.status === 'OK' || response.success) {
                    setVisible(false);
                    formik.resetForm();
                    showSuccessAlert(response.message ||
                        (isEditMode ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente'),
                        () => {
                            if (onSuccess) onSuccess();
                        }
                    );
                } else {
                    showErrorAlert(response.message ||
                        (isEditMode ? 'Error al actualizar el usuario' : 'Error al crear el usuario')
                    );
                }
            } catch (error) {
                console.log("Error al procesar la solicitud:", error);
                showErrorAlert('Ocurrió un error al procesar la solicitud');
            }
        }
    });

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    React.useEffect(() => {
        if (isEditMode && userToEdit) {
            formik.setValues({
                firstName: userToEdit.firstName,
                lastName: userToEdit.lastName,
                surname: userToEdit.surname,
                rfc: userToEdit.rfc,
                email: userToEdit.email,
                password: '', 
                phone: userToEdit.phone,
                birthdate: userToEdit.birthdate ? new Date(userToEdit.birthdate) : null
            });
        }
    }, [userToEdit, isEditMode]);

    return (
        <Dialog
            header={isEditMode ? "Editar usuario" : "Crear usuario"}
            visible={visible}
            className='w-full md:w-[40vw]'
            onHide={() => {
                setVisible(false);
                formik.resetForm();
            }}
        >
            <form onSubmit={formik.handleSubmit} className='mt-8'>
                <div className='mt-4'>
                    <FloatLabel className='w-full'>
                        <InputText
                            id="firstName"
                            name="firstName"
                            className={`border ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                            value={formik.values.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                        <label htmlFor="firstName">Nombre</label>
                    </FloatLabel>
                    {formik.touched.firstName && formik.errors.firstName && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
                    )}
                </div>

                <div className={`${formik.touched.firstName && formik.errors.firstName ? 'mt-8' : 'mt-7'} w-full flex flex-col justify-between items-start md:flex-row`}>
                    <div className='w-full md:w-[47%]'>
                        <FloatLabel>
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
                        <FloatLabel>
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

                <div className={`${formik.touched.email && formik.errors.email ? 'mt-8' : 'mt-7'}`}>
                    <FloatLabel className='w-full'>
                        <InputText
                            id="password"
                            name="password"
                            type="password"
                            className={`border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                            value={formik.values.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            placeholder={isEditMode ? "" : ""}
                            disabled={isEditMode}
                        />
                        <label htmlFor="password">Contraseña</label>
                    </FloatLabel>
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                    )}
                </div>

                <div className={`${formik.touched.password && formik.errors.password ? 'mt-8' : 'mt-7'} flex flex-col justify-between items-start md:flex-row`}>
                    <div className='w-full md:w-[47%]'>
                        <FloatLabel className='w-full'>
                            <InputText
                                id="phone"
                                name="phone"
                                className={`border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                value={formik.values.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                            <label htmlFor="phone">Teléfono</label>
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
                                onChange={(e) => handleChange('birthdate', e.value)}
                                className={`border ${formik.touched.birthdate && formik.errors.birthdate ? 'border-red-500' : 'border-gray-300'} min-h-10 h-10 pl-4 w-full rounded-md`}
                                dateFormat="yy/mm/dd"
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
                        {formik.isSubmitting
                            ? 'Procesando...'
                            : isEditMode ? 'Actualizar usuario' : 'Registrar usuario'}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};