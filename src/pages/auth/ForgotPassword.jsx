import React from 'react';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthService } from '../../services/AuthService';

export const ForgotPassword = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("El correo es obligatorio")
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    "El correo no es válido"
                ),
        }),
        onSubmit: async (values) => {
            console.log('Enviando datos:', values);
            try {
                const response = await AuthService.sendEmail(values.email);
                console.log('Respuesta del servidor:', response);
            } catch (error) {
                console.error('Error en el inicio de sesión:', error);
            }
        },
    });

    return (
        <div className='h-screen w-full bg-gray-50 flex items-center justify-center flex-col'>
            <div className='shadow-lg rounded-lg max-w-md mx-auto bg-white p-6 w-full'>
                <h1 className='text-2xl font-bold text-center'>¿Olvidaste tu contraseña?</h1>
                <p className='text-center mt-4 font-light'>
                    Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                </p>

                <form onSubmit={formik.handleSubmit} className='mt-6'>
                    <div className='mb-4'>
                        <label htmlFor='email' className='block text-sm font-medium mb-1'>
                            Correo electrónico
                        </label>
                        <InputText
                            id='email'
                            name='email'
                            type='email'
                            placeholder='ejemplo@correo.com'
                            className={`w-full border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-200'} min-h-10 pl-4`}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-describedby='email-help'
                        />
                        {formik.touched.email && formik.errors.email && (
                            <small className='text-red-500'>{formik.errors.email}</small>
                        )}
                        {!formik.errors.email && (
                            <small id='email-help' className='text-gray-500'>
                                Ingresa tu correo electrónico registrado.
                            </small>
                        )}
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'
                    >
                        Enviar correo
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <p className='text-sm font-bold text-blue-600'>
                        <i className="pi pi-arrow-left align-middle mr-1" style={{ fontSize: '0.8rem' }} />
                        <a href='/'>
                            Volver a iniciar sesión
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};
