import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getUserProfile, register as apiRegister } from '../api/api';
import {
  setSecureItem,
  getSecureItem,
  deleteSecureItem,
  validateToken,
  validateUserData,
  validateRegistrationData,
} from '../utils/authContextUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (authToken) => {
    if (!authToken || !validateToken(authToken)) {
      setUser(null);
      return false;
    }

    try {
      const response = await getUserProfile(authToken);
      const userData = response?.data?.user;

      if (userData) {
        setUser(validateUserData(userData));
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      setUser(null);
      return false;
    }
  }, []);


  const initializeAuth = useCallback(async () => {
    try {
      const storedToken = await getSecureItem('token');

      if (storedToken && validateToken(storedToken)) {
        const userLoaded = await loadUserData(storedToken);
        if (userLoaded) {
          setToken(storedToken);
        } else {
          await deleteSecureItem('token');
          setToken(null);
          setUser(null);
        }
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

  // Login function

  const login = useCallback(
    async (newToken) => {
      if (!newToken || !validateToken(newToken)) {
        throw new Error('Invalid token');
      }

      try {
        const userLoaded = await loadUserData(newToken);
        if (userLoaded) {
          await setSecureItem('token', newToken);
          setToken(newToken);
        } else {
          throw new Error('Failed to load user data');
        }
      } catch (error) {
        throw new Error('Failed to save token');
      }
    },
    [loadUserData],
  );

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
    clearExpiredToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
