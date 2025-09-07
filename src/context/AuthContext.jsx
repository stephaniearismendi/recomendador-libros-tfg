import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile, register as apiRegister } from '../api/api';
import { 
  setSecureItem, 
  getSecureItem, 
  deleteSecureItem, 
  validateToken, 
  validateUserData, 
  validateRegistrationData 
} from '../utils/authContextUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (authToken) => {
    if (!authToken || !validateToken(authToken)) {
      setUser(null);
      return;
    }

    try {
      const response = await getUserProfile(authToken);
      const userData = response?.data?.user;
      
      if (userData) {
        setUser(validateUserData(userData));
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const storedToken = await getSecureItem('token');
      
      if (storedToken && validateToken(storedToken)) {
        setToken(storedToken);
        await loadUserData(storedToken);
      } else if (storedToken) {
        await deleteSecureItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadUserData]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (newToken) => {
    if (!newToken || !validateToken(newToken)) {
      throw new Error('Invalid token');
    }

    try {
      await setSecureItem('token', newToken);
      setToken(newToken);
      await loadUserData(newToken);
    } catch (error) {
      throw new Error('Failed to save token');
    }
  }, [loadUserData]);

  const register = useCallback(async (userData) => {
    const validatedData = validateRegistrationData(userData);
    if (!validatedData) {
      throw new Error('Invalid registration data');
    }

    try {
      const response = await apiRegister(validatedData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await deleteSecureItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      setToken(null);
      setUser(null);
    }
  }, []);

  const clearExpiredToken = useCallback(async () => {
    try {
      await deleteSecureItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      setToken(null);
      setUser(null);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (token && validateToken(token)) {
      await loadUserData(token);
    } else {
      await clearExpiredToken();
    }
  }, [token, loadUserData, clearExpiredToken]);

  const value = {
    token,
    user,
    login,
    register,
    logout,
    loading,
    refreshUserData,
    clearExpiredToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
