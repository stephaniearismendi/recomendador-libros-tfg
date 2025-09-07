import { getBookCoverUri, validateBookData } from './imageUtils';

export const formatBookForPost = (book) => {
  if (!book) return null;
  
  return {
    id: book.id,
    title: book.title,
    author: book.author || 'Autor desconocido',
    cover: getBookCoverUri(book)
  };
};

export const validatePostData = (text, book) => {
  return text?.trim() && text.trim().length > 0;
};

export const formatPostPayload = (text, book) => ({
  text: text.trim(),
  book: formatBookForPost(book)
});

export const getSafeFavorites = (favorites) => {
  return Array.isArray(favorites) 
    ? favorites.filter(validateBookData)
    : [];
};
