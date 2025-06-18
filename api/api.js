import axios from 'axios';
import { API_URL } from '../config';

export const register = async (userData) => {
  return axios.post(`${API_URL}/users/register`, userData);
};

export const login = async (credentials) => {
  return axios.post(`${API_URL}/users/login`, credentials);
};

export const getBooks = async (token) => {
  return axios.get(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addFavorite = async (userId, bookId, token) => {
  return axios.post(`${API_URL}/favorites`, { userId, bookId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeFavorite = async (userId, bookId, token) => {
  return axios.delete(`${API_URL}/favorites/${userId}/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
