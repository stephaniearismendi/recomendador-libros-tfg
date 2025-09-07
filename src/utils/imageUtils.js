const DEFAULT_COVER = 'https://upload.wikimedia.org/wikipedia/commons/b/b9/No_Cover.jpg';

export const getBookCoverUri = (book) => {
  if (!book) return DEFAULT_COVER;
  
  const { image, cover, coverUrl } = book;
  
  if (typeof image === 'string') return image;
  if (image?.uri) return image.uri;
  if (cover) return cover;
  if (coverUrl) return coverUrl;
  
  return DEFAULT_COVER;
};

export const validateBookData = (book) => {
  return book && (book.id || book.title);
};
