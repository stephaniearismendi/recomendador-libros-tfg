const FALLBACK_IMG = 'https://covers.openlibrary.org/b/id/240727-S.jpg';

export const firstIsbn = (book = {}) => {
  if (Array.isArray(book.isbn) && book.isbn[0]) return String(book.isbn[0]);
  if (typeof book.primary_isbn13 === 'string' && book.primary_isbn13) return book.primary_isbn13;
  if (typeof book.primary_isbn10 === 'string' && book.primary_isbn10) return book.primary_isbn10;
  if (typeof book.isbn13 === 'string' && book.isbn13) return book.isbn13;
  if (typeof book.isbn10 === 'string' && book.isbn10) return book.isbn10;
  if (Array.isArray(book.isbns) && (book.isbns[0]?.isbn13 || book.isbns[0]?.isbn10)) {
    return book.isbns[0].isbn13 || book.isbns[0].isbn10;
  }
  return null;
};

export const canonicalId = (id) =>
  String(id ?? '')
    .replace(/^\/?works\//, '')
    .trim();

export const resolveCoverUri = (book = {}, details = {}) => {
  const candidates = [
    typeof book.image === 'string' ? book.image : null,
    typeof book.image === 'object' && book.image?.uri ? book.image.uri : null,
    book.book_image || null,
    book.imageUrl || book.coverUrl || book.cover || null,
    typeof details.image === 'string' ? details.image : null,
    details.imageUrl || details.coverUrl || null,
  ].filter(Boolean);
  
  if (candidates.length > 0) return candidates[0];
  
  const isbn = firstIsbn(book) || firstIsbn(details);
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  if (book.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  
  const title = book.title || details.title;
  if (title) return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg`;
  
  return FALLBACK_IMG;
};

export const getBookRating = (details, book) => {
  return details.rating ?? book.rating ?? null;
};

export const isBookComplete = (book) => {
  return book?.description && book?.author && book?.title;
};
