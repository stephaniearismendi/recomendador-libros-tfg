import { categorizeBook } from './bookCategorizer';

export const loadHomeData = async () => {
  const { getPopularBooks, getAdaptedBooks, getNewYorkTimesBooks } = await import('../api/api');
  
  const [popularRes, adaptedRes, nytRes] = await Promise.allSettled([
    getPopularBooks(),
    getAdaptedBooks(),
    getNewYorkTimesBooks(),
  ]);

  return {
    popularBooks: popularRes.status === 'fulfilled' ? popularRes.value.data || [] : [],
    adaptedBooks: adaptedRes.status === 'fulfilled' ? adaptedRes.value.data || [] : [],
    nytBooks: nytRes.status === 'fulfilled' ? nytRes.value.data || [] : [],
  };
};

export const applyGenreFilters = (books, selectedFilters) => {
  if (!selectedFilters || !selectedFilters.genres?.length) return books;
  
  return books.filter((book) => {
    const bookData = {
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
    };
    
    const bookCategory = categorizeBook(bookData);
    
    return selectedFilters.genres.some(genreId => {
      return bookCategory.genre === genreId;
    });
  });
};

export const combineBookLists = (books, adaptedBooks, nytBooks) => {
  return [...books, ...adaptedBooks, ...nytBooks];
};

export const createBookSection = (title, data, emptyMessage) => ({
  title,
  data,
  emptyMessage,
});

export const getBookSections = (filteredPopular, filteredAdapted, filteredNytBooks) => [
  createBookSection(
    'Libros populares',
    filteredPopular,
    'No hay libros que coincidan con los filtros seleccionados.'
  ),
  createBookSection(
    'Adaptaciones cinematográficas',
    filteredAdapted,
    'No se encontraron libros adaptados al cine.'
  ),
  createBookSection(
    'Más vendidos',
    filteredNytBooks,
    'No se encontraron libros de la lista de más vendidos.'
  ),
];
