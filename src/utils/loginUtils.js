import { Alert } from 'react-native';

export const validateLoginForm = (email, password) => {
  if (!email.trim() || !password.trim()) {
    return {
      isValid: false,
      error: 'Por favor, completa todos los campos.'
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Por favor, introduce un email válido.'
    };
  }
  
  return { isValid: true, error: null };
};

export const getLoginErrorMessage = (error) => {
  if (error.response?.status === 401) {
    return 'Credenciales incorrectas. Verifica tu email y contraseña.';
  } else if (error.response?.status === 500) {
    return 'Error del servidor. Inténtalo más tarde.';
  } else if (error.response?.status === 429) {
    return 'Demasiados intentos. Espera un momento antes de intentar de nuevo.';
  } else if (error.response?.status === 403) {
    return 'Tu cuenta ha sido suspendida. Contacta con soporte.';
  } else if (!error.response) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
  }
};

export const handleLoginError = (error) => {
  return getLoginErrorMessage(error);
};

