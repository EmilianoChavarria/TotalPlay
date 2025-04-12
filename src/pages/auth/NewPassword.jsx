import React from 'react';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthService } from '../../services/AuthService';

export const NewPassword = () => {
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required('La contraseña es obligatoria')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                    'Debe contener mayúscula, minúscula, número y carácter especial'
                ),
            confirmPassword: Yup.string()
                .required('Confirma tu contraseña')
                .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
        }),
        onSubmit: async (values) => {
            try {
                console.log('Cambiando contraseña...', values);

                const response = await AuthService.changePassword({
                    userId: localStorage.getItem("id"),
                    password: values.password
                });

                console.log('Contraseña cambiada con éxito:', response);

                await Swal.fire({
                    icon: 'success',
                    title: 'Contraseña actualizada',
                    text: 'Tu contraseña ha sido cambiada exitosamente',
                    timer: 2000
                });

            } catch (error) {
                console.error('Error al cambiar contraseña:', error.message);

                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message.includes('401')
                        ? 'No autorizado - Por favor inicia sesión nuevamente'
                        : 'Error al cambiar la contraseña',
                    confirmButtonText: 'Entendido'
                });

                if (error.message.includes('401')) {
                    AuthService.logout();
                    navigate('/login');
                }
            }
        },
    });

    return (
        <div className='h-screen w-full bg-gray-50 flex items-center justify-center flex-col'>
            <div className='shadow-lg rounded-lg max-w-md mx-auto bg-white p-6 w-full'>
                <h1 className='text-2xl font-bold text-center'>Restablece tu contraseña</h1>
                <p className='text-center mt-4 font-light'>
                    Ingresa una nueva contraseña para tu cuenta.
                </p>

                <form onSubmit={formik.handleSubmit} className='mt-6'>

                    {/* Contraseña */}
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-medium mb-1'>
                            Nueva contraseña
                        </label>
                        <InputText
                            id='password'
                            name='password'
                            type='password'
                            placeholder='********'
                            className={`w-full border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-200'} min-h-10 pl-4`}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <small className='text-red-500'>{formik.errors.password}</small>
                        )}
                        {!formik.errors.password && (
                            <small className='text-gray-500'>
                                Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
                            </small>
                        )}
                    </div>

                    {/* Confirmar contraseña */}
                    <div className='mb-4'>
                        <label htmlFor='confirmPassword' className='block text-sm font-medium mb-1'>
                            Confirmar contraseña
                        </label>
                        <InputText
                            id='confirmPassword'
                            name='confirmPassword'
                            type='password'
                            placeholder='********'
                            className={`w-full border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} min-h-10 pl-4`}
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <small className='text-red-500'>{formik.errors.confirmPassword}</small>
                        )}
                        {!formik.errors.confirmPassword && (
                            <small className='text-gray-500'>
                                Repite la contraseña anterior exactamente.
                            </small>
                        )}
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200'
                    >
                        Guardar contraseña
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <p className='text-sm font-bold text-blue-600'>
                        <i className="pi pi-arrow-left align-middle mr-1" style={{ fontSize: '0.8rem' }} />
                        <a href='/'>
                            Volver al inicio
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};
