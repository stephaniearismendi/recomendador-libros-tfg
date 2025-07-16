import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        setToken(storedToken);
      } catch (err) {
        console.error('Error cargando token', err);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token) => {
    try {
      await SecureStore.setItemAsync('token', token);
      setToken(token);
    } catch (err) {
      console.error('Error guardando token', err);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
    } catch (err) {
      console.error('Error eliminando token', err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
