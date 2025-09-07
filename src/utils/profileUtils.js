import { Alert } from 'react-native';

export const validateProfileData = (data) => {
  if (!data) return { isValid: false, error: 'Datos no válidos' };
  
  const { name, username, bio } = data;
  
  if (!name || !name.trim()) {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  
  if (!username || !username.trim()) {
    return { isValid: false, error: 'El nombre de usuario es requerido' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'El nombre de usuario solo puede contener letras, números y guiones bajos' };
  }
  
  return { isValid: true, error: null };
};

export const validatePasswordChange = (data) => {
  if (!data) return { isValid: false, error: 'Datos no válidos' };
  
  const { currentPassword, newPassword, confirmPassword } = data;
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { isValid: false, error: 'Por favor completa todos los campos' };
  }
  
  if (newPassword !== confirmPassword) {
    return { isValid: false, error: 'Las contraseñas nuevas no coinciden' };
  }
  
  if (newPassword.length < 6) {
    return { isValid: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
  }
  
  if (currentPassword === newPassword) {
    return { isValid: false, error: 'La nueva contraseña debe ser diferente a la actual' };
  }
  
  return { isValid: true, error: null };
};

export const validateDeleteConfirmation = (confirmation) => {
  if (!confirmation || confirmation.toLowerCase() !== 'eliminar') {
    return { isValid: false, error: 'Debes escribir "ELIMINAR" para confirmar' };
  }
  return { isValid: true, error: null };
};

export const getProfileErrorMessage = (error) => {
  if (error?.response?.status === 401) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
  } else if (error?.response?.status === 409) {
    return 'El nombre de usuario ya está en uso';
  } else if (error?.response?.status === 400) {
    return 'La contraseña actual es incorrecta';
  } else if (error?.response?.status === 422) {
    return 'Los datos no cumplen con los requisitos';
  } else if (!error.response) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
  }
};

export const handleProfileError = (error, logout) => {
  const message = getProfileErrorMessage(error);
  
  if (error?.response?.status === 401) {
    Alert.alert('Error', message, [
      { text: 'OK', onPress: logout }
    ]);
  } else {
    Alert.alert('Error', message);
  }
};


export const formatUserStats = (user) => {
  if (!user?._count) return { favorites: 0, following: 0, followers: 0 };
  
  return {
    favorites: user._count.favorites || 0,
    following: user._count.following || 0,
    followers: user._count.followers || 0
  };
};

export const formatJoinDate = (createdAt) => {
  if (!createdAt) return 'Fecha no disponible';
  
  return new Date(createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });
};

export const getInitialEditData = (user) => {
  if (!user) return { name: '', username: '', bio: '' };
  
  return {
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
  };
};

export const getInitialPasswordData = () => ({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

export const showLogoutConfirmation = (logout) => {
  Alert.alert(
    'Cerrar sesión',
    '¿Estás seguro de que quieres cerrar sesión?',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]
  );
};

export const showDeleteAccountConfirmation = (onConfirm) => {
  Alert.alert(
    'Cuenta eliminada',
    'Tu cuenta ha sido eliminada permanentemente.',
    [
      {
        text: 'OK',
        onPress: onConfirm
      }
    ]
  );
};
