import Swal from 'sweetalert2';

export const showSuccessAlert = (message, callback = null) => {
  Swal.fire({
    title: 'Éxito',
    text: message,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    customClass: {
      container: 'z-9999'
    }
  }).then(() => {
    if (callback && typeof callback === 'function') {
      callback();
    }
  });
};

export const showErrorAlert = (message, callback = null) => {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error',
    confirmButtonText: 'Aceptar',
    customClass: {
      container: 'z-9999'
    }
  }).then(() => {
    if (callback && typeof callback === 'function') {
      callback();
    }
  });
};

export const showConfirmAlert = (message, confirmCallback, cancelCallback = null) => {
  Swal.fire({
    title: message,
    text: 'Esta acción no se puede deshacer',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    customClass: {
      container: 'z-9999'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      if (confirmCallback && typeof confirmCallback === 'function') {
        confirmCallback();
      }
    } else if (cancelCallback && typeof cancelCallback === 'function') {
      cancelCallback();
    }
  });
};

// Componente de alertas (opcional, si necesitas un componente React)
const CustomAlerts = () => {
  return null; // Este componente no renderiza nada, solo exporta las funciones
};

export default CustomAlerts;