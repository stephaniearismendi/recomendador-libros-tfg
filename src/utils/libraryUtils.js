import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {
  getFavorites,
  getPopularBooks,
  addFavorite,
  removeFavorite,
  getPersonalRecommendations,
} from '../api/api';

const READING_KEY = 'current_reading';
const PROGRESS_KEY = 'progress_map';
const CHALLENGE_KEY = 'reading_challenge_goal';

export const loadUserData = async (userId) => {
  try {
    const [readingData, progressData, challengeData] = await Promise.all([
      AsyncStorage.getItem(`${READING_KEY}:${userId}`),
      AsyncStorage.getItem(`${PROGRESS_KEY}:${userId}`),
      AsyncStorage.getItem(`${CHALLENGE_KEY}:${userId}:${new Date().getFullYear()}`)
    ]);

    return {
      reading: readingData ? JSON.parse(readingData) : null,
      progressMap: progressData ? JSON.parse(progressData) : {},
      challengeGoal: challengeData ? parseInt(challengeData, 10) : null
    };
  } catch (error) {
    console.error('Error loading user data:', error);
    return { reading: null, progressMap: {}, challengeGoal: null };
  }
};

export const saveUserData = async (userId, data) => {
  try {
    const { reading, progressMap, challengeGoal } = data;
    const year = new Date().getFullYear();
    
    const promises = [];
    
    if (reading !== undefined) {
      if (reading) {
        promises.push(AsyncStorage.setItem(`${READING_KEY}:${userId}`, JSON.stringify(reading)));
      } else {
        promises.push(AsyncStorage.removeItem(`${READING_KEY}:${userId}`));
      }
    }
    
    if (progressMap !== undefined) {
      promises.push(AsyncStorage.setItem(`${PROGRESS_KEY}:${userId}`, JSON.stringify(progressMap)));
    }
    
    if (challengeGoal !== undefined) {
      if (challengeGoal) {
        promises.push(AsyncStorage.setItem(`${CHALLENGE_KEY}:${userId}:${year}`, String(challengeGoal)));
      } else {
        promises.push(AsyncStorage.removeItem(`${CHALLENGE_KEY}:${userId}:${year}`));
      }
    }
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const loadLibraryData = async (userId, token) => {
  try {
    let favorites = [];
    let recommendations = [];

    if (userId && token) {
      const [favRes, recRes] = await Promise.all([
        getFavorites(userId, token).catch(() => ({ data: [] })),
        getPersonalRecommendations({ userId }, token).catch(() => ({ data: [] }))
      ]);
      
      favorites = favRes?.data || [];
      recommendations = recRes?.data || [];
    }

    if (recommendations.length === 0) {
      const popRes = await getPopularBooks();
      recommendations = popRes?.data || [];
    }

    return {
      favorites,
      recommendations: recommendations.slice(0, 6)
    };
  } catch (error) {
    console.error('Error loading library data:', error);
    const popRes = await getPopularBooks();
    return {
      favorites: [],
      recommendations: (popRes?.data || []).slice(0, 6)
    };
  }
};

export const toggleFavorite = async (book, favorites, userId, token) => {
  try {
    if (!userId || !token) {
      Alert.alert(
        'Sesión Requerida', 
        'Tu sesión ha expirado o se ha limpiado. Por favor, inicia sesión nuevamente para gestionar tus favoritos.',
        [{ text: 'OK' }]
      );
      return { favorites, recommendations: [] };
    }
    
    const isFavorite = favorites.some(fav => fav.id === book.id);
    
    if (isFavorite) {
      await removeFavorite(userId, book.id, token);
    } else {
      await addFavorite(userId, book, token);
    }

    const [favRes, recRes] = await Promise.all([
      getFavorites(userId, token),
      getPersonalRecommendations({ userId }, token).catch(() => ({ data: [] }))
    ]);

    return {
      favorites: favRes.data || [],
      recommendations: (recRes?.data || []).slice(0, 6)
    };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    Alert.alert('Error', `No se pudo actualizar favoritos: ${error.response?.data?.error || error.message}`);
    return { favorites, recommendations: [] };
  }
};

export const calculateStats = (favorites, progressMap) => {
  const read = favorites.filter(book => {
    const progress = progressMap[book.id];
    return progress && progress.totalPages && progress.pagesRead >= progress.totalPages;
  }).length;

  const inProgress = favorites.filter(book => {
    const progress = progressMap[book.id];
    return progress && progress.totalPages && progress.pagesRead > 0 && progress.pagesRead < progress.totalPages;
  }).length;

  const toRead = favorites.filter(book => {
    const progress = progressMap[book.id];
    return !progress || !progress.pagesRead || progress.pagesRead === 0;
  }).length;

  return { read, inProgress, toRead };
};

export const calculateProgressPercentage = (reading, progressMap) => {
  if (!reading) return 0;
  const progress = progressMap[reading.id];
  if (!progress || !progress.totalPages) return 0;
  return Math.max(0, Math.min(100, Math.round((progress.pagesRead / progress.totalPages) * 100)));
};

export const updateProgress = (progressMap, bookId, updates) => {
  const current = progressMap[bookId] || { totalPages: 0, pagesRead: 0 };
  return {
    ...progressMap,
    [bookId]: { ...current, ...updates }
  };
};

export const validateProgressInput = (tempPercent, tempPage, totalPages) => {
  const hasPercent = tempPercent.trim() !== '' && !isNaN(parseInt(tempPercent, 10));
  const hasPage = tempPage.trim() !== '' && !isNaN(parseInt(tempPage, 10));
  
  if (!hasPercent && !hasPage) return null;
  
  let pagesRead = 0;
  
  if (hasPercent) {
    const percent = Math.max(0, Math.min(100, parseInt(tempPercent, 10)));
    pagesRead = totalPages > 0 ? Math.round((percent / 100) * totalPages) : 0;
  } else if (hasPage) {
    const page = Math.max(0, parseInt(tempPage, 10));
    pagesRead = totalPages > 0 ? Math.min(page, totalPages) : page;
  }
  
  return pagesRead;
};

export const getBookKey = (book) => {
  return book?.key || book?.id || book?.olid || book?.workId;
};
