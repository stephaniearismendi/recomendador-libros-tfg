const GENRE_LABELS = {
  'Todos': null,
  'Ficción': 'fiction',
  'Romántica': 'romance',
  'Misterio': 'mystery',
  'Fantasía': 'fantasy',
  'Ciencia Ficción': 'sci-fi',
  'Thriller': 'thriller'
};

export const getAvailableGenres = () => Object.keys(GENRE_LABELS);

export const getGenreValue = (label) => GENRE_LABELS[label] || null;

export const getGenreLabel = (value) => {
  const entry = Object.entries(GENRE_LABELS).find(([_, val]) => val === value);
  return entry ? entry[0] : 'Todos';
};

export const isGenreSelected = (selected, genre) => {
  if (genre === 'Todos') return !selected;
  return selected === getGenreValue(genre);
};

export const handleGenreSelect = (genre, onSelect) => {
  const value = getGenreValue(genre);
  onSelect(value);
};
