import axios from 'axios';
import { API_URL } from '../../config';

/* ───────────── helpers ───────────── */

const authHeaders = (token) => {
  if (!token) {
    return { headers: {} };
  }
  
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  const authHeader = `Bearer ${cleanToken}`;
  
  return { headers: { Authorization: authHeader } };
};


// ISBN en varios formatos (incluye NYT)
const firstIsbn = (b = {}) => {
  if (Array.isArray(b.isbn) && b.isbn[0]) return String(b.isbn[0]);
  if (typeof b.primary_isbn13 === 'string' && b.primary_isbn13) return b.primary_isbn13;
  if (typeof b.primary_isbn10 === 'string' && b.primary_isbn10) return b.primary_isbn10;
  if (typeof b.isbn13 === 'string' && b.isbn13) return b.isbn13;
  if (typeof b.isbn10 === 'string' && b.isbn10) return b.isbn10;
  if (Array.isArray(b.isbns) && (b.isbns[0]?.isbn13 || b.isbns[0]?.isbn10)) {
    return b.isbns[0].isbn13 || b.isbns[0].isbn10;
  }
  return null;
};

// URL de portada desde campos comunes + NYT + ISBN + fallback por título
export const coverFrom = (b = {}) => {
  const str = typeof b.image === 'string' ? b.image : null;
  const obj = typeof b.image === 'object' && b.image?.uri ? b.image.uri : null;
  const nyt = typeof b.book_image === 'string' ? b.book_image : null; // NYT
  const direct = str || obj || nyt || b.imageUrl || b.coverUrl || b.cover;
  if (direct) return direct;

  const isbn = firstIsbn(b);
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

  if (b.cover_i) return `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`;
  if (b.title) return `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`;
  return null;
};

// Asegura que el ID tenga una barra inicial para la ruta
const asPathBookId = (raw) => {
  const s = String(raw ?? '')
    .trim();
  
  // Si no empieza con barra, agregar una
  const withSlash = s.startsWith('/') ? s : `/${s}`;
  
  return encodeURIComponent(withSlash); // viaja como un solo segmento
};

/* ───────────── Auth ───────────── */

export const register = (userData) => axios.post(`${API_URL}/users/register`, userData);
export const login = (credentials) => axios.post(`${API_URL}/users/login`, credentials);
export const getUserIdFromToken = (token) => axios.get(`${API_URL}/users/me`, authHeaders(token));

/* ───────────── Books ───────────── */

export const getBooks = (token) => axios.get(`${API_URL}/books`, authHeaders(token));
export const searchBooks = (query = 'bestsellers') =>
  axios.get(`${API_URL}/books/search?q=${encodeURIComponent(query)}`);
export const getPopularBooks = () => axios.get(`${API_URL}/books/popular`);
export const getBooksByGenre = (genre) =>
  axios.get(`${API_URL}/books/genre?g=${encodeURIComponent(genre)}`);
export const getBookDetails = (key) => {
  const cleanedKey = key?.replace?.(/^\/?works\//, '') ?? key;
  return axios.get(`${API_URL}/books/${cleanedKey}/details`);
};
export const getAdaptedBooks = () => axios.get(`${API_URL}/books/adapted`);
export const getNewYorkTimesBooks = () => axios.get(`${API_URL}/books/nytBooks`);
export const getPersonalRecommendations = (payload, token) =>
  axios.post(`${API_URL}/recommendations/personal`, payload, authHeaders(token));

/* ───────────── Favorites ───────────── */

export const getFavorites = (userId, token) => {
  return axios.get(`${API_URL}/books/favorites/${userId}`, authHeaders(token));
};

export const addFavorite = (userId, bookOrId, token) => {
  const id =
    typeof bookOrId === 'string' || typeof bookOrId === 'number'
      ? String(bookOrId)
      : String(bookOrId?.id);

  const img = typeof bookOrId === 'object' ? coverFrom(bookOrId) || null : null;

  const body =
    typeof bookOrId === 'object'
      ? {
          title: bookOrId.title,
          author: bookOrId.author,
          imageUrl: img,
          image: img,
          description: bookOrId.description ?? null,
          rating: bookOrId.rating ?? null,
          category: bookOrId.genre ?? null,
          // pistas opcionales (NYT / ISBN)
          book_image: bookOrId.book_image ?? null,
          primary_isbn13: bookOrId.primary_isbn13 ?? null,
          primary_isbn10: bookOrId.primary_isbn10 ?? null,
          isbns: bookOrId.isbns ?? null,
          isbn: bookOrId.isbn ?? null,
        }
      : {};

  const pathId = asPathBookId(id);
  return axios.post(`${API_URL}/favorites/${userId}/${pathId}`, body, authHeaders(token));
};

export const removeFavorite = (userId, bookId, token) => {
  const pathId = asPathBookId(bookId);
  return axios.delete(`${API_URL}/favorites/${userId}/${pathId}`, authHeaders(token));
};

/* ───────────── Social ───────────── */

export const getFeed = (token) => {
  if (token) {
    return axios.get(`${API_URL}/social/feed`, authHeaders(token));
  } else {
    return axios.get(`${API_URL}/social/feed`);
  }
};
export const createPost = (payload, token) =>
  axios.post(`${API_URL}/social/posts`, payload, authHeaders(token));
export const likePost = (postId, token) =>
  axios.post(`${API_URL}/social/posts/${postId}/like`, {}, authHeaders(token));
export const commentPost = (postId, text, token) =>
  axios.post(`${API_URL}/social/posts/${postId}/comments`, { text }, authHeaders(token));

export const getClubs = () => axios.get(`${API_URL}/social/clubs`);
export const toggleJoinClub = (clubId, token) =>
  axios.post(`${API_URL}/social/clubs/${clubId}/toggle`, {}, authHeaders(token));

export const getRandomUsers = (count = 8) =>
  axios.get('https://randomuser.me/api/', {
    params: { results: count, inc: 'name,picture,login', noinfo: 1, nat: 'es,gb,fr,de,it' },
  });

export const getSuggestions = (token) => {
  return axios.get(`${API_URL}/social/suggestions`, authHeaders(token));
};

export const getSuggestionsNoAuth = () => {
  return axios.get(`${API_URL}/social/suggestions-no-auth`);
};

export const getSuggestionsTemp = (token) => {
  return axios.get(`${API_URL}/social/suggestions-temp`, authHeaders(token));
};

export const getAllUsers = () => {
  return axios.get(`${API_URL}/social/users`);
};


export const followUser = (userId, token) => {
  const url = `${API_URL}/social/follow/${userId}`;
  return axios.post(url, {}, authHeaders(token));
};

export const unfollowUser = (userId, token) => {
  const url = `${API_URL}/social/follow/${userId}`;
  return axios.delete(url, authHeaders(token));
};

export const toggleFollow = (userId, token) => {
  const url = `${API_URL}/social/follow/${userId}/toggle`;
  return axios.post(url, {}, authHeaders(token));
};

export const getFollowStatus = (userId, token) => {
  const url = `${API_URL}/social/follow/${userId}/status`;
  return axios.get(url, authHeaders(token));
};

export const getFollowing = (userId, token) => {
  const url = `${API_URL}/social/users/${userId}/following`;
  return axios.get(url, authHeaders(token));
};

export const getFollowers = (userId, token) => {
  const url = `${API_URL}/social/users/${userId}/followers`;
  return axios.get(url, authHeaders(token));
};

export const createTestUsers = (token) => {
  const url = `${API_URL}/social/test-users`;
  return axios.post(url, {}, authHeaders(token));
};

/* ───────────── Stories ───────────── */

export const createStory = (storyData, token) => {
  const url = `${API_URL}/social/stories`;
  return axios.post(url, storyData, authHeaders(token));
};

export const getStories = (token) => {
  const url = `${API_URL}/social/stories`;
  return axios.get(url, authHeaders(token));
};

export const cleanExpiredStories = (token) => {
  const url = `${API_URL}/social/stories/clean`;
  return axios.post(url, {}, authHeaders(token));
};

export const seedStories = () => {
  const url = `${API_URL}/social/stories/seed`;
  return axios.post(url, {});
};


/* ───────────── Club de lectura (capítulos + mensajes) ───────────── */

export const createClub = (payload, token) =>
  axios.post(`${API_URL}/social/clubs`, payload, authHeaders(token));

// Club Room
export const getClub = (clubId) =>
  axios.get(`${API_URL}/social/clubs/${encodeURIComponent(clubId)}`);

export const getClubChapters = (clubId) =>
  axios.get(`${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters`);

export const createClubChapter = (clubId, data, token) =>
  axios.post(`${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters`, data, authHeaders(token));

export const getChapterComments = (clubId, chapter) =>
  axios.get(`${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters/${chapter}/comments`);

export const postChapterComment = (clubId, chapter, text, token) =>
  axios.post(
    `${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters/${chapter}/comments`,
    { text },
    authHeaders(token)
  );

// Keep the old function names for backward compatibility
export const getChapterMessages = getChapterComments;
export const postChapterMessage = postChapterComment;

/* ───────────── User Profile ───────────── */

export const getUserProfile = (token) => {
  return axios.get(`${API_URL}/users/profile`, authHeaders(token));
};

export const updateUserProfile = (profileData, token) =>
  axios.put(`${API_URL}/users/profile`, profileData, authHeaders(token));

export const updateUserAvatar = (avatarUrl, token) =>
  axios.put(`${API_URL}/users/avatar`, { avatar: avatarUrl }, authHeaders(token));