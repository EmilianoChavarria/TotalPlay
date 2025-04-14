import { showErrorAlert, showSuccessAlert } from "./CustomAlerts";

// formUtils.js
export const getFieldClasses = (fieldName, formik, fieldType = 'input') => {
    const baseClasses = {
        input: 'min-h-10 pl-4 w-full border',
        calendar: 'min-h-10 h-10 pl-4 w-full rounded-md border'
    };

    return `${baseClasses[fieldType]} ${formik.touched[fieldName] && formik.errors[fieldName]
            ? 'border-red-500'
            : 'border-gray-300'
        }`;
};

export const handleApiResponse = (response, isEditMode, setVisible, formik, onSuccess, entityName) => {
    if (response.status === 'OK' || response.success) {
        setVisible(false);
        showSuccessAlert(
            response.message || (isEditMode ? `${entityName} actualizado exitosamente` : `${entityName} creado exitosamente`),
            () => onSuccess?.()
        );
    } else {
        showErrorAlert(
            response.message || (isEditMode ? `Error al actualizar el ${entityName}` : `Error al crear el ${entityName}`)
        );
    }
};