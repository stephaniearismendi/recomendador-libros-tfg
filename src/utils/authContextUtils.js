import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const setSecureItem = async (key, value) => {
  if (Platform.OS === 'web') {
    return AsyncStorage.setItem(key, value);
  }
  return SecureStore.setItemAsync(key, value);
};

export const getSecureItem = async (key) => {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
};

export const deleteSecureItem = async (key) => {
  if (Platform.OS === 'web') {
    return AsyncStorage.removeItem(key);
  }
  return SecureStore.deleteItemAsync(key);
};

export const validateToken = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

export const getTokenData = (token) => {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const validateUserData = (userData) => {
  if (!userData) return null;

  return {
    id: userData.id,
    name: userData.name || userData.username || 'Usuario',
    username: userData.username,
    email: userData.email,
    avatar: userData.avatar,
    bio: userData.bio,
    _count: userData._count,
    createdAt: userData.createdAt,
    created_at: userData.created_at,
    joinedAt: userData.joinedAt,
    joined_at: userData.joined_at,
    dateCreated: userData.dateCreated,
    registrationDate: userData.registrationDate,
  };
};

export const validateRegistrationData = (data) => {
  if (!data) return null;

  const { name, username, email, password } = data;

  if (!name || !username || !email || !password) {
    return null;
  }

  return {
    name: String(name).trim(),
    username: String(username).trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
  };
};
