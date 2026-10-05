import Swal from 'sweetalert2';

/**
 * Utilidad de alertas estilizadas con SweetAlert2 para ATMORA-APP
 */

export const showSuccessAlert = async (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#ff732e',
    confirmButtonText: 'Aceptar',
    heightAuto: false,
    customClass: {
      popup: 'atmora-swal-popup',
      confirmButton: 'atmora-swal-btn'
    }
  });
};

export const showErrorAlert = async (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#1a3a5a',
    confirmButtonText: 'Entendido',
    heightAuto: false,
    customClass: {
      popup: 'atmora-swal-popup',
      confirmButton: 'atmora-swal-btn'
    }
  });
};

export const showWarningAlert = async (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#ff732e',
    confirmButtonText: 'Entendido',
    heightAuto: false,
    customClass: {
      popup: 'atmora-swal-popup',
      confirmButton: 'atmora-swal-btn'
    }
  });
};

export const showInfoAlert = async (title: string, text?: string) => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonColor: '#1a3a5a',
    confirmButtonText: 'Aceptar',
    heightAuto: false,
    customClass: {
      popup: 'atmora-swal-popup',
      confirmButton: 'atmora-swal-btn'
    }
  });
};

export const showConfirmDialog = async (title: string, text?: string, confirmText: string = 'Sí, continuar', cancelText: string = 'Cancelar') => {
  const result = await Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#ff732e',
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    heightAuto: false,
    customClass: {
      popup: 'atmora-swal-popup',
      confirmButton: 'atmora-swal-btn',
      cancelButton: 'atmora-swal-btn'
    }
  });
  return result.isConfirmed;
};

export const showUpdateAlert = async () => {
  const result = await Swal.fire({
    icon: 'info',
    title: '¡Actualización Disponible! 🚀',
    text: 'Hay una nueva versión de la aplicación ATMORA (v1.0.2) con mejoras de rendimiento y estabilidad.',
    showCancelButton: true,
    confirmButtonColor: '#ff732e',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Actualizar ahora',
    cancelButtonText: 'Más tarde',
    heightAuto: false,
    customClass: {
      popup: 'atmora-swal-popup',
      confirmButton: 'atmora-swal-btn',
      cancelButton: 'atmora-swal-btn'
    }
  });

  if (result.isConfirmed) {
    await Swal.fire({
      icon: 'success',
      title: '¡Actualización Exitosa!',
      text: 'Tu aplicación ha sido actualizada correctamente a la versión v1.0.2.',
      confirmButtonColor: '#ff732e',
      confirmButtonText: 'Entendido',
      heightAuto: false,
      customClass: {
        popup: 'atmora-swal-popup',
        confirmButton: 'atmora-swal-btn'
      }
    });
  }
};
