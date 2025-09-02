import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

async function setItem(key, value) {
  if (Platform.OS === 'web') return AsyncStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}

async function getItem(key) {
  if (Platform.OS === 'web') return AsyncStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key) {
  if (Platform.OS === 'web') return AsyncStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await getItem('token');
        setToken(stored);
      } catch (e) {
        console.error('Error cargando token', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (newToken) => {
    try {
      await setItem('token', newToken);
      setToken(newToken);
    } catch (e) {
      console.error('Error guardando token', e);
    }
  };

  const logout = async () => {
    try {
      await deleteItem('token');
      setToken(null);
    } catch (e) {
      console.error('Error eliminando token', e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
