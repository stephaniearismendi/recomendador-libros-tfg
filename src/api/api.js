import axios from 'axios';
import { API_URL } from '../../config';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Auth
export const register = (userData) => axios.post(`${API_URL}/users/register`, userData);

export const login = (credentials) => axios.post(`${API_URL}/users/login`, credentials);

// Books
export const getBooks = (token) => axios.get(`${API_URL}/books`, authHeaders(token));

export const searchBooks = (query = 'bestsellers') =>
  axios.get(`${API_URL}/books/search?q=${encodeURIComponent(query)}`);

export const getPopularBooks = () => axios.get(`${API_URL}/books/popular`);

export const getBooksByGenre = (genre) =>
  axios.get(`${API_URL}/books/genre?g=${encodeURIComponent(genre)}`);

export const getBookDetails = (key) => {
  const cleanedKey = key.replace(/^\/?works\//, '');
  return axios.get(`${API_URL}/books/${cleanedKey}/details`);
};

export const getAdaptedBooks = () => axios.get(`${API_URL}/books/adapted`);

export const getNewYorkTimesBooks = () => axios.get(`${API_URL}/books/nytBooks`);

// Favorites
export const getFavorites = (userId, token) =>
  axios.get(`${API_URL}/books/favorites/${userId}`, authHeaders(token));

export const addFavorite = (userId, bookId, token) =>
  axios.post(`${API_URL}/books/favorites`, { userId, bookId }, authHeaders(token));

export const removeFavorite = (userId, bookId, token) =>
  axios.delete(`${API_URL}/books/favorites/${userId}/${bookId}`, authHeaders(token));
