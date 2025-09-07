import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { getUserProfile, register as apiRegister } from '../api/api';

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (authToken) => {
    if (!authToken) {
      console.log('🔍 AuthContext: No token provided, setting user to null');
      setUser(null);
      return;
    }

    try {
      console.log('🔍 AuthContext: Loading user data with token...');
      const response = await getUserProfile(authToken);
      console.log('🔍 AuthContext: getUserProfile response:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        hasUser: !!response?.data?.user,
        user: response?.data?.user
      });
      
      if (response?.data?.user) {
        console.log('✅ AuthContext: User data loaded successfully:', response.data.user);
        setUser(response.data.user);
      } else {
        console.log('❌ AuthContext: No user data in response');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ AuthContext: Error cargando datos del usuario:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = await getItem('token');
        console.log('🔍 AuthContext: Token loaded from storage:', {
          hasToken: !!stored,
          tokenLength: stored?.length || 0,
          tokenPreview: stored ? stored.substring(0, 20) + '...' : 'none'
        });
        setToken(stored);
        if (stored) {
          await loadUserData(stored);
        }
      } catch (e) {
        console.error('Error cargando token', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (newToken) => {
    try {
      console.log('🔍 AuthContext: Login called with token:', {
        hasToken: !!newToken,
        tokenLength: newToken?.length || 0,
        tokenPreview: newToken ? newToken.substring(0, 20) + '...' : 'none'
      });
      await setItem('token', newToken);
      setToken(newToken);
      await loadUserData(newToken);
      console.log('✅ AuthContext: Login completed successfully');
    } catch (e) {
      console.error('Error guardando token', e);
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔍 AuthContext: Register called with data:', {
        hasName: !!userData.name,
        hasUsername: !!userData.username,
        hasEmail: !!userData.email,
        hasPassword: !!userData.password
      });
      
      const response = await apiRegister(userData);
      console.log('✅ AuthContext: Registration successful');
      return response;
    } catch (e) {
      console.error('❌ AuthContext: Registration failed:', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await deleteItem('token');
      setToken(null);
      setUser(null);
      console.log('✅ User logged out successfully');
    } catch (e) {
      console.error('Error eliminando token', e);
    }
  };

  const clearExpiredToken = async () => {
    try {
      await deleteItem('token');
      setToken(null);
      setUser(null);
      console.log('✅ Expired token cleared');
    } catch (e) {
      console.error('Error clearing expired token', e);
    }
  };

  const refreshUserData = async () => {
    if (token) {
      await loadUserData(token);
    }
  };


  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      register,
      logout, 
      loading, 
      refreshUserData,
      clearExpiredToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};
