import { getBookCoverUri } from './imageUtils';

export const validateProgress = (progress) => {
  const num = Number(progress);
  return Math.max(0, Math.min(100, isNaN(num) ? 0 : num));
};

export const formatBookData = (book) => {
  if (!book?.title) return null;
  
  return {
    title: book.title,
    author: book.author || null,
    cover: getBookCoverUri(book)
  };
};

export const getProgressPercentage = (progress) => {
  return validateProgress(progress);
};

export const hasValidBook = (book) => {
  return book && book.title && book.title.trim().length > 0;
};
