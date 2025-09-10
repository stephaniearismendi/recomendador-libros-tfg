export const validateStatValue = (value) => {
  const num = Number(value);
  return Math.max(0, isNaN(num) ? 0 : num);
};

export const formatStatsData = (stats = {}) => {
  return {
    read: validateStatValue(stats.read),
    inProgress: validateStatValue(stats.inProgress ?? stats.reading),
    toRead: validateStatValue(stats.toRead),
  };
};

export const getStatItems = (stats) => {
  try {
    const formatted = formatStatsData(stats);
    return [
      { label: 'Leídos', value: formatted.read },
      { label: 'En curso', value: formatted.inProgress },
      { label: 'Por leer', value: formatted.toRead },
    ];
  } catch (error) {
    console.error('Error formatting stat items:', error);
    return [
      { label: 'Leídos', value: 0 },
      { label: 'En curso', value: 0 },
      { label: 'Por leer', value: 0 },
    ];
  }
};
