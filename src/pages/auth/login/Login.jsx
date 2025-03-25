import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required("El correo es obligatorio")
            .matches(
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                "El correo no es válido"
            ),
        password: Yup.string()
            .required("La contraseña es obligatoria")
            .min(8, "Mínimo 8 caracteres")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{8,}$/,
                "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
            ),
    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('Datos del formulario:', values);
            navigate('/dashboard');
        },
    });

    // Handler para cambios en los inputs
    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    // Alternar visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className='h-screen w-full bg-gray-100 flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 min-w-[25%]'>
                <h1 className='text-2xl font-bold text-center'>Inicio de sesión</h1>

                <form onSubmit={formik.handleSubmit} className='mt-8'>
                    <div className='mt-4'>
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
                            <div className="p-inputgroup">
                                <InputText
                                    id="password"
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    className={`border-t border-b border-l ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                                    value={formik.values.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                />
                                <Button
                                    type="button"
                                    icon={passwordVisible ? "pi pi-eye-slash" : "pi pi-eye"}
                                    className={`p-button-text border-t border-b border-r ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    onClick={togglePasswordVisibility}
                                />
                            </div>
                            <label htmlFor="password">Contraseña</label>
                        </FloatLabel>
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
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
            </div>
        </div>
    );
};