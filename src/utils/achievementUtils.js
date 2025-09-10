import {
  getUserStats as apiGetUserStats,
  getUserAchievements as apiGetUserAchievements,
  getAllAchievements as apiGetAllAchievements,
  updateReadingProgress as apiUpdateReadingProgress,
  getReadingChallenge as apiGetReadingChallenge,
  setReadingChallenge as apiSetReadingChallenge,
} from '../api/api';

export const RARITY_COLORS = {
  common: '#95A5A6',
  uncommon: '#2ECC71',
  rare: '#3498DB',
  epic: '#9B59B6',
  legendary: '#F39C12',
};

export const loadAllAchievements = async (token) => {
  try {
    if (!token) {
      throw new Error('Token requerido para cargar achievements');
    }

    const response = await apiGetAllAchievements(token);
    const result = response.data?.data || response.data || response;

    if (!result || typeof result !== 'object') {
      throw new Error('Respuesta inválida del servidor');
    }

    if (Array.isArray(result)) {
      const achievementsMap = {};
      result.forEach((achievement) => {
        if (achievement.id) {
          achievementsMap[achievement.id] = achievement;
        }
      });
      return achievementsMap;
    }

    if (result.achievements && typeof result.achievements === 'object') {
      return result.achievements;
    }

    throw new Error('Formato de datos inesperado');
  } catch (error) {
    console.error('Error loading all achievements:', error);
    throw error;
  }
};

export const loadUserAchievements = async (userId, token) => {
  try {
    if (!userId || !token) {
      console.warn('loadUserAchievements: Faltan userId o token');
      return { achievements: [], totalPoints: 0 };
    }

    const response = await apiGetUserAchievements(userId, token);
    const result = response.data?.data || response.data || response;

    if (!result || typeof result !== 'object') {
      console.warn('loadUserAchievements: Respuesta inválida del servidor');
      return { achievements: [], totalPoints: 0 };
    }

    return {
      achievements: Array.isArray(result.achievements) ? result.achievements : [],
      totalPoints: typeof result.totalPoints === 'number' ? result.totalPoints : 0,
      ...result,
    };
  } catch (error) {
    console.error('Error loading user achievements:', error);
    return { achievements: [], totalPoints: 0 };
  }
};

export const loadUserAchievementsWithDetails = async (userId, token) => {
  try {
    const [allAchievements, userAchievements] = await Promise.all([
      loadAllAchievements(token),
      loadUserAchievements(userId, token),
    ]);

    const userAchievementsMap = new Map();
    userAchievements.achievements.forEach((ua) => {
      userAchievementsMap.set(ua.id, ua);
    });

    const achievementsWithStatus = Object.values(allAchievements).map((achievement) => {
      const userAchievement = userAchievementsMap.get(achievement.id);
      const isUnlocked = userAchievement && userAchievement.progress >= 100;

      return {
        ...achievement,
        unlocked: isUnlocked,
        progress: userAchievement?.progress || 0,
        unlockedAt: isUnlocked ? userAchievement?.unlockedAt || new Date().toISOString() : null,
      };
    });

    const unlockedAchievements = achievementsWithStatus.filter((a) => a.unlocked);
    const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

    return {
      achievements: achievementsWithStatus,
      totalPoints: totalPoints,
      unlockedCount: unlockedAchievements.length,
      totalCount: Object.keys(allAchievements).length,
    };
  } catch (error) {
    console.error('Error loading user achievements with details:', error);
    throw error;
  }
};

export const loadUserStats = async (userId, token) => {
  try {
    if (!userId || !token) {
      console.warn('loadUserStats: Faltan userId o token');
      return getDefaultStats();
    }

    const response = await apiGetUserStats(userId, token);
    const stats = response.data?.data || response.data || response;

    if (!stats || typeof stats !== 'object') {
      console.warn('loadUserStats: Respuesta inválida del servidor');
      return getDefaultStats();
    }

    return {
      totalBooksRead: stats.totalBooksRead || 0,
      totalPagesRead: stats.totalPagesRead || 0,
      genresExplored: stats.genresExplored || 0,
      currentStreak: stats.currentStreak || 0,
      challengeCompleted: stats.challengeCompleted || false,
      ...stats,
    };
  } catch (error) {
    console.error('Error loading user stats:', error);
    return getDefaultStats();
  }
};

const getDefaultStats = () => ({
  totalBooksRead: 0,
  totalPagesRead: 0,
  genresExplored: 0,
  currentStreak: 0,
  challengeCompleted: false,
});

export const testStatsEndpoint = async (userId, token) => {
  try {
    console.log('Testing stats endpoint...');
    const response = await apiGetUserStats(userId, token);
    console.log('Stats endpoint response:', response);
    return response;
  } catch (error) {
    console.error('Stats endpoint error:', error);
    throw error;
  }
};

export const updateReadingProgress = async (userId, bookId, progressData, token) => {
  try {
    if (!userId || !bookId || !progressData || !token) {
      throw new Error('Faltan parámetros requeridos para actualizar el progreso');
    }

    if (typeof progressData.pagesRead !== 'number' || typeof progressData.totalPages !== 'number') {
      throw new Error('Los datos de progreso deben contener números válidos');
    }

    if (progressData.pagesRead < 0 || progressData.totalPages <= 0) {
      throw new Error('Los valores de páginas no son válidos');
    }

    if (progressData.pagesRead > progressData.totalPages) {
      throw new Error('Las páginas leídas no pueden ser mayores que el total');
    }

    const requestData = {
      userId,
      bookId,
      pagesRead: progressData.pagesRead,
      totalPages: progressData.totalPages,
      completed: progressData.completed || 0,
      isCompleted: Boolean(progressData.isCompleted),
      lastReadAt: new Date().toISOString(),
    };

    const response = await apiUpdateReadingProgress(requestData, token);

    if (!response) {
      throw new Error('No se recibió respuesta del servidor');
    }

    const result = response.data || response;
    return result;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(
        'Endpoint de progreso no encontrado. El progreso se guardará solo localmente.',
      );
    }

    if (error.response?.status === 500) {
      throw new Error(
        'Error interno del servidor. El progreso se guardará localmente y se sincronizará más tarde.',
      );
    }

    if (error.message.includes('HTTP error')) {
      throw new Error('Error de conexión con el servidor. Verifica tu conexión a internet.');
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    throw error;
  }
};

export const getReadingChallenge = async (userId, year, token) => {
  try {
    const response = await apiGetReadingChallenge(userId, year, token);
    return response.data || response;
  } catch (error) {
    return null;
  }
};

export const setReadingChallenge = async (userId, goal, year, token) => {
  try {
    const response = await apiSetReadingChallenge(
      {
        userId,
        goal,
        year,
      },
      token,
    );
    return response.data || response;
  } catch (error) {
    throw error;
  }
};
