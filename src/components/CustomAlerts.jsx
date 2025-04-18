import Swal from 'sweetalert2';

export const showSuccessAlert = (message, callback = null) => {
  Swal.fire({
    title: 'Éxito',
    text: message,
    icon: 'success',
    showConfirmButton: false,
    timer: 1000, 
    customClass: {
      container: 'z-9999'
    },
    didClose: () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
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

const CustomAlerts = () => {
  return null; 
};

export default CustomAlerts;