export const calculateProgressPercentage = (progress, total) => {
  if (!progress || !total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((progress / total) * 100)));
};

export const formatProgressPercentage = (progress, total) => {
  const percentage = calculateProgressPercentage(progress, total);
  return `${percentage}%`;
};

export const validateProgressData = (progress, total) => {
  if (typeof progress !== 'number' || typeof total !== 'number') {
    return { isValid: false, error: 'Los valores de progreso deben ser números' };
  }
  
  if (progress < 0) {
    return { isValid: false, error: 'El progreso no puede ser negativo' };
  }
  
  if (total <= 0) {
    return { isValid: false, error: 'El total debe ser mayor que 0' };
  }
  
  if (progress > total) {
    return { isValid: false, error: 'El progreso no puede ser mayor que el total' };
  }
  
  return { isValid: true, error: null };
};

export const getProgressColor = (percentage) => {
  if (percentage >= 100) return '#10B981'; // Green
  if (percentage >= 75) return '#3B82F6'; // Blue
  if (percentage >= 50) return '#F59E0B'; // Yellow
  if (percentage >= 25) return '#EF4444'; // Red
  return '#6B7280'; // Gray
};

export const getProgressStatus = (percentage) => {
  if (percentage >= 100) return 'Completado';
  if (percentage >= 75) return 'Casi terminado';
  if (percentage >= 50) return 'En progreso';
  if (percentage >= 25) return 'Comenzando';
  return 'Iniciando';
};

export const formatProgressText = (progress, total) => {
  if (!progress || !total) return '0 / 0';
  return `${progress} / ${total}`;
};
