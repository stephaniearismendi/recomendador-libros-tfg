import { Alert } from 'react-native';

export const validateRegistrationForm = (formData) => {
  const { name, username, email, password, confirmPassword } = formData;
  
  if (!name.trim()) {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  
  if (!username.trim()) {
    return { isValid: false, error: 'El nombre de usuario es requerido' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'El nombre de usuario solo puede contener letras, números y guiones bajos' };
  }
  
  if (!email.trim()) {
    return { isValid: false, error: 'El email es requerido' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Ingresa un email válido' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Las contraseñas no coinciden' };
  }
  
  return { isValid: true, error: null };
};

export const getRegistrationErrorMessage = (error) => {
  if (error?.response?.status === 409) {
    return 'El email o nombre de usuario ya está en uso';
  } else if (error?.response?.status === 400) {
    return 'Datos inválidos. Verifica la información ingresada';
  } else if (error?.response?.status === 422) {
    return 'Los datos no cumplen con los requisitos';
  } else if (!error.response) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    return 'No se pudo crear la cuenta. Inténtalo de nuevo.';
  }
};

export const handleRegistrationError = (error) => {
  return getRegistrationErrorMessage(error);
};


export const showRegistrationSuccess = (navigation) => {
  Alert.alert(
    '¡Registro exitoso!',
    'Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.',
    [
      {
        text: 'Iniciar sesión',
        onPress: () => navigation.navigate('Login'),
      },
    ]
  );
};

export const getInitialFormData = () => ({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

export const formatRegistrationData = (formData) => ({
  name: formData.name.trim(),
  username: formData.username.trim(),
  email: formData.email.trim().toLowerCase(),
  password: formData.password,
});
