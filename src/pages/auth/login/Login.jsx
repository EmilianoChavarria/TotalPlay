import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../../services/AuthService';

import { useAuth } from '../../../context/AuthContext';


export const Login = () => {
    const { login } = useAuth();

    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);

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
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:;¿¡\-_+#~()[\]{}|^/\\])[A-Za-z\d@$!%*?&.,:;¿¡\-_+#~()[\]{}|^/\\]{8,}$/,
                "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
            ),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('Datos del formulario:', values);
            try {
                const response = await AuthService.login(values.email, values.password);
                console.log('Respuesta del servidor:', response);

                if (response.jwt) {
                    login(response.jwt); 

                    if (response.temporal === "true") {
                        navigate('/new-password'); 
                    } else {
                        navigate('/dashboard/home'); 
                    }
                }
            } catch (error) {
                console.error('Error en el inicio de sesión:', error);
            }
        },

    });

    const handleChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, true, false);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard/home');
        }
    }, [navigate]);

    return (
        <div className='h-screen w-full bg-gray-100 flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 max-w-[100%] shadow-lg xl:w-[25%] xl:max-w-[25%] 2xl:w-[20%] 2xl:max-w-[20%]'>
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
                    <div className='mt-4 text-sm text-center'>
                        ¿Has olvidado tu contraseña? <a href="/forgot-password" className='text-blue-500 hover:text-blue-600'>Recuperar</a>
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