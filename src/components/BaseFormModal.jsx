import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';

export const BaseFormModal = ({
    visible,
    setVisible,
    title,
    initialValues,
    validationSchema,
    onSubmit,
    children,
    isEditMode,
    enableReinitialize = false 
}) => {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            await onSubmit(values, { setSubmitting });
        }
    });

    useEffect(() => {
        if (enableReinitialize) {
            formik.resetForm({ values: initialValues });
        }
    }, [initialValues, enableReinitialize]);

    return (
        <Dialog
            header={title}
            visible={visible}
            className='w-full md:w-[40vw]'
            onHide={() => {
                setVisible(false);
            }}
        >
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                {children(formik)}

                <div className="mt-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-200"
                        disabled={formik.isSubmitting}
                    >
                        {isEditMode ? 'Actualizar' : 'Registrar'}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};
