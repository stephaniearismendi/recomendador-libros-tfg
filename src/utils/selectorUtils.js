export const isOptionSelected = (selected, option) => {
  return selected === option;
};

export const handleOptionSelect = (option, selected, onSelect) => {
  const newSelection = option === selected ? null : option;
  onSelect(newSelection);
};

export const validateOptions = (options) => {
  if (!Array.isArray(options)) return [];
  return options.filter(option => option != null && String(option).trim().length > 0);
};

export const getSafeLabel = (label) => {
  return label && String(label).trim().length > 0 ? String(label).trim() : 'Seleccionar';
};
