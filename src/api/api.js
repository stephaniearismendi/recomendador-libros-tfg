import axios from 'axios';
import { API_URL } from '../../config';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const coverFrom = (b) => {
  const str = typeof b?.image === 'string' ? b.image : null;
  const obj = typeof b?.image === 'object' && b?.image?.uri ? b.image.uri : null;
  return (
    str ||
    obj ||
    b?.imageUrl ||
    b?.coverUrl ||
    b?.cover ||
    (b?.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : null) ||
    (Array.isArray(b?.isbn) && b.isbn[0]
      ? `https://covers.openlibrary.org/b/isbn/${b.isbn[0]}-M.jpg`
      : null) ||
    (b?.title
      ? `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`
      : null)
  );
};

const asPathBookId = (raw) => {
  const s = String(raw ?? '')
    .trim()
    .replace(/^\/+/, '/');
  return encodeURIComponent(s);
};

// Auth
export const register = (userData) => axios.post(`${API_URL}/users/register`, userData);
export const login = (credentials) => axios.post(`${API_URL}/users/login`, credentials);
export const getUserIdFromToken = (token) => axios.get(`${API_URL}/users/me`, authHeaders(token));

// Books
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

// Favorites
export const getFavorites = (userId, token) =>
  axios.get(`${API_URL}/books/favorites/${userId}`, authHeaders(token));

export const addFavorite = (userId, bookOrId, token) => {
  const id =
    typeof bookOrId === 'string' || typeof bookOrId === 'number'
      ? String(bookOrId)
      : String(bookOrId?.id);

  const body =
    typeof bookOrId === 'object'
      ? {
          title: bookOrId.title,
          author: bookOrId.author,
          imageUrl: coverFrom(bookOrId) || null,
          description: bookOrId.description ?? '',
          rating: bookOrId.rating ?? null,
          category: bookOrId.genre ?? '',
        }
      : {};

  const pathId = asPathBookId(id);
  return axios.post(`${API_URL}/favorites/${userId}/${pathId}`, body, authHeaders(token));
};

export const removeFavorite = (userId, bookId, token) => {
  const pathId = asPathBookId(bookId);
  return axios.delete(`${API_URL}/favorites/${userId}/${pathId}`, authHeaders(token));
};

// Social
export const getFeed = (token) => axios.get(`${API_URL}/social/feed`, authHeaders(token));
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
export const getSuggestions = (token) =>
  axios.get(`${API_URL}/social/suggestions`, authHeaders(token));
export const toggleFollow = (userId, token) =>
  axios.post(`${API_URL}/social/follow/${userId}/toggle`, {}, authHeaders(token));
