import React, { useEffect, useState, useCallback, useMemo, useContext, useRef } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import CurrentlyReadingCard from '../components/CurrentlyReadingCard';
import StatsRow from '../components/StatsRow';
import BookCarousel from '../components/BookCarousel';
import ReadingChallenge from '../components/ReadingChallenge';
import BookCard from '../components/BookCard';
import { libraryStyles } from '../styles/components';
import { baseStyles, COLORS } from '../styles/baseStyles';
import {
  loadUserData,
  saveUserData,
  loadLibraryData,
  toggleFavorite,
  calculateStats,
  calculateProgressPercentage,
  updateProgress,
  validateProgressInput,
  getBookKey,
} from '../utils/libraryUtils';
import { useCustomSafeArea } from '../utils/safeAreaUtils';
import {
  loadUserAchievementsWithDetails,
  loadUserStats,
  updateReadingProgress,
  setReadingChallenge,
  getReadingChallenge,
} from '../utils/achievementUtils';
import {
  startReadingSession,
  updateReadingSession,
  endReadingSession,
  getActiveReadingSession,
} from '../api/api';
import AchievementBadge from '../components/AchievementBadge';
import AchievementNotification from '../components/AchievementNotification';

export default function LibraryScreen() {
  const navigation = useNavigation();
  const { token, user, logout } = useContext(AuthContext);
  const { getContainerStyle, getScrollStyle } = useCustomSafeArea();
  const year = new Date().getFullYear();
  const userId = user?.id || null;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reading, setReading] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [achievements, setAchievements] = useState({ unlocked: [], points: 0 });
  const [challengeGoal, setChallengeGoal] = useState(null);
  const [statsUpdateTrigger, setStatsUpdateTrigger] = useState(0);

  const [activeSession, setActiveSession] = useState(null);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pagesModalVisible, setPagesModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const [tempPages, setTempPages] = useState('');
  const [tempPercent, setTempPercent] = useState('');
  const [tempPage, setTempPage] = useState('');
  const [tempGoal, setTempGoal] = useState('');
  const [currentNotification, setCurrentNotification] = useState(null);
  const sendingProgressRef = useRef(new Set());
  const lastProcessedRef = useRef({});
  const processingRef = useRef(false);
  const progressQueueRef = useRef([]);

  useEffect(() => {
    (async () => {
      if (!userId || !token) {
        console.warn('LibraryScreen: Faltan userId o token');
        return;
      }

      try {
        const [userData, achievementsData, challengeData] = await Promise.all([
          loadUserData(userId),
          loadUserAchievementsWithDetails(userId, token),
          getReadingChallenge(userId, year, token).catch(() => null),
        ]);

        setReading(userData.reading || null);
        setProgressMap(userData.progressMap || {});
        setChallengeGoal(challengeData?.goal || userData.challengeGoal || 0);
        setAchievements(achievementsData || { achievements: [], totalPoints: 0 });

        if (userData.reading) {
          try {
            const activeSessionResponse = await getActiveReadingSession(userData.reading.id, token);
            if (activeSessionResponse.data) {
              setActiveSession(activeSessionResponse.data.data);
            }
          } catch (error) {
            console.warn('Error loading active session:', error);
          }
        }
      } catch (error) {
        console.error('Error loading library data:', error);
        setReading(null);
        setProgressMap({});
        setChallengeGoal(0);
        setAchievements({ achievements: [], totalPoints: 0 });
      }
    })();
  }, [userId, token, year]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        setLoading(true);
        try {
          const libraryData = await loadLibraryData(userId, token);
          if (isActive) {
            setFavorites(libraryData.favorites);
            setRecommendations(libraryData.recommendations);
          }

          if (reading && libraryData.favorites.every((f) => f.id !== reading.id)) {
            if (isActive) {
              setReading(null);
              await saveUserData(userId, { reading: null });
            }
          }
        } catch (error) {
        } finally {
          if (isActive) setLoading(false);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [userId, token, reading]),
  );

  const processProgressQueue = useCallback(async () => {
    if (processingRef.current || progressQueueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;

    while (progressQueueRef.current.length > 0) {
      const next = progressQueueRef.current.shift();

      try {
        let currentBook = null;

        if (reading && next[reading.id]) {
          const progress = next[reading.id];
          const pagesRead = progress.pagesRead || 0;
          const totalPages = progress.totalPages || 0;
          const hasProgress = pagesRead > 0;
          const isCompleted = totalPages > 0 && pagesRead >= totalPages;
          if (hasProgress || isCompleted) {
            currentBook = reading.id;
          }
        }

        if (!currentBook) {
          currentBook = Object.keys(next).find((bookId) => {
            const progress = next[bookId];
            const pagesRead = progress.pagesRead || 0;
            const totalPages = progress.totalPages || 0;
            const hasProgress = pagesRead > 0;
            const isCompleted = totalPages > 0 && pagesRead >= totalPages;
            return hasProgress || isCompleted;
          });
        }

        if (!currentBook) {
          setProgressMap(next);
          await saveUserData(userId, { progressMap: next });
          continue;
        }

        if (sendingProgressRef.current.has(currentBook)) {
          setProgressMap(next);
          await saveUserData(userId, { progressMap: next });
          continue;
        }

        const progressData = next[currentBook];
        const pagesRead = progressData.pagesRead || 0;
        const totalPages = progressData.totalPages || 0;
        const isCompleted = totalPages > 0 && pagesRead >= totalPages;

        const progressKey = `${currentBook}-${pagesRead}-${totalPages}-${isCompleted}`;
        const now = Date.now();
        const lastProcessed = lastProcessedRef.current[progressKey];

        if (lastProcessed && now - lastProcessed < 3000) {
          setProgressMap(next);
          await saveUserData(userId, { progressMap: next });
          continue;
        }

        lastProcessedRef.current[progressKey] = now;
        sendingProgressRef.current.add(currentBook);

        try {
          const progressDataToSend = {
            pagesRead: pagesRead,
            totalPages: totalPages,
            isCompleted: isCompleted,
            completion: isCompleted,
          };

          const response = await updateReadingProgress(
            userId,
            currentBook,
            progressDataToSend,
            token,
          );

          sendingProgressRef.current.delete(currentBook);

          if (response.newAchievements?.length > 0) {
            showAchievementNotification(response.newAchievements[0]);
          }
        } catch (gamificationError) {
          sendingProgressRef.current.delete(currentBook);
        }

        setProgressMap(next);
        await saveUserData(userId, { progressMap: next });
        if (isCompleted) {
          setStatsUpdateTrigger((prev) => prev + 1);
        }
      } catch (error) {
        setProgressMap(next);
        await saveUserData(userId, { progressMap: next });
      }
    }

    processingRef.current = false;
  }, [userId, token, showAchievementNotification, reading]);

  const persistProgress = useCallback(
    async (next) => {
      if (!token || !userId) return;

      progressQueueRef.current.push(next);
      await processProgressQueue();
    },
    [processProgressQueue, userId, token],
  );

  const showAchievementNotification = useCallback((achievement) => {
    setCurrentNotification(achievement);
    setNotificationVisible(true);
  }, []);

  const handleNotificationClose = useCallback(() => {
    setNotificationVisible(false);
    setCurrentNotification(null);
  }, []);

  const modalHandlers = useMemo(
    () => ({
      openPages: () => setPagesModalVisible(true),
      closePages: () => setPagesModalVisible(false),
      openProgress: () => setProgressModalVisible(true),
      closeProgress: () => setProgressModalVisible(false),
      openChallenge: () => setChallengeModalVisible(true),
      closeChallenge: () => setChallengeModalVisible(false),
      openPicker: () => setPickerVisible(true),
      closePicker: () => setPickerVisible(false),
    }),
    [],
  );

  const handleToggleFavorite = useCallback(
    async (book) => {
      const result = await toggleFavorite(book, favorites, userId, token);
      setFavorites(result.favorites);
      setRecommendations(result.recommendations);

      if (reading && reading.id === book.id && !result.favorites.some((f) => f.id === book.id)) {
        setReading(null);
        await saveUserData(userId, { reading: null });
      }
    },
    [favorites, reading, token, userId],
  );

  const chooseReading = useCallback(
    async (book) => {
      sendingProgressRef.current.clear();
      lastProcessedRef.current = {};
      processingRef.current = false;
      progressQueueRef.current = [];
      setReading(book);
      await saveUserData(userId, { reading: book });

      // TEMPORAL: Limpiar progressMap corrupto con IDs que no existen en la BD
      const hasCorruptedData = Object.keys(progressMap).some((key) => key === '/9780593158715');
      if (hasCorruptedData) {
        setProgressMap({});
        await saveUserData(userId, { progressMap: {} });
        // Continuar con el flujo normal después de limpiar
      }

      const progress = progressMap[book.id];
      if (!progress || !progress.totalPages) {
        setTempPages('');
        modalHandlers.openPages();
        modalHandlers.closePicker();
        return;
      }

      try {
        try {
          const existingSession = await getActiveReadingSession(book.id, token);
          if (existingSession.data) {
            setActiveSession(existingSession.data.data);
          }
        } catch (sessionError) {
          if (sessionError.response?.status === 404) {
          } else {
          }
        }

        if (!activeSession) {
          const sessionData = {
            userId,
            bookId: book.id,
            pagesRead: progress.pagesRead || 0,
            totalPages: progress.totalPages,
          };

          try {
            const sessionResponse = await startReadingSession(sessionData, token);
            setActiveSession(sessionResponse.data.data);
          } catch (createError) {
            if (createError.response?.status === 409) {
              try {
                const existingSession = await getActiveReadingSession(book.id, token);
                if (existingSession.data) {
                  setActiveSession(existingSession.data.data);
                }
              } catch (verifyError) {}
            } else {
              throw createError;
            }
          }
        }
      } catch (error) {}

      modalHandlers.closePicker();
    },
    [progressMap, userId, token],
  );

  const clearReading = useCallback(async () => {
    if (activeSession) {
      try {
        await endReadingSession({ sessionId: activeSession.id }, token);
        setActiveSession(null);
      } catch (error) {}
    }

    setReading(null);
    await saveUserData(userId, { reading: null });
  }, [userId, activeSession, token]);

  const saveTotalPages = useCallback(async () => {
    const total = parseInt(tempPages, 10);
    if (!reading || isNaN(total) || total <= 0) return;

    const next = updateProgress(progressMap, reading.id, { totalPages: total });
    await persistProgress(next);
    setPagesModalVisible(false);
    setTempPages('');

    try {
      try {
        const existingSession = await getActiveReadingSession(reading.id, token);
        if (existingSession.data) {
          setActiveSession(existingSession.data);
        }
      } catch (sessionError) {
        if (sessionError.response?.status === 404) {
        } else {
        }
      }

      if (!activeSession) {
        const sessionData = {
          userId,
          bookId: reading.id,
          pagesRead: 0,
          totalPages: total,
        };

        try {
          const sessionResponse = await startReadingSession(sessionData, token);
          setActiveSession(sessionResponse.data.data);
        } catch (createError) {
          if (createError.response?.status === 409) {
            try {
              const existingSession = await getActiveReadingSession(reading.id, token);
              if (existingSession.data) {
                setActiveSession(existingSession.data.data);
              }
            } catch (verifyError) {}
          } else {
            throw createError;
          }
        }
      }
    } catch (error) {}
  }, [reading, tempPages, progressMap, persistProgress, userId, token]);

  const openProgressModal = useCallback(() => {
    if (!reading) return;
    const progress = progressMap[reading.id];
    const total = progress?.totalPages || 0;
    const pagesRead = progress?.pagesRead || 0;
    const percent = total > 0 ? Math.round((pagesRead / total) * 100) : 0;
    setTempPercent(percent ? String(percent) : '');
    setTempPage(pagesRead ? String(pagesRead) : '');
    modalHandlers.openProgress();
  }, [reading, progressMap, modalHandlers]);

  const saveProgress = useCallback(async () => {
    if (!reading) return;
    const current = progressMap[reading.id] || { totalPages: 0, pagesRead: 0 };
    const total = current.totalPages || 0;
    const pagesRead = validateProgressInput(tempPercent, tempPage, total);
    if (pagesRead === null) return;

    const next = updateProgress(progressMap, reading.id, { pagesRead });
    await persistProgress(next);
    modalHandlers.closeProgress();
    setTempPercent('');
    setTempPage('');

    if (total > 0 && pagesRead >= total) {
      setReading(null);
      await saveUserData(userId, { reading: null });
      setStatsUpdateTrigger((prev) => prev + 1);

      try {
        const updatedAchievements = await loadUserAchievementsWithDetails(userId, token);
        setAchievements(updatedAchievements);
      } catch (error) {
        console.error('Error updating achievements:', error);
      }
    }
  }, [reading, tempPercent, tempPage, progressMap, persistProgress, userId, modalHandlers]);

  const readingProgressPercent = useMemo(() => {
    return calculateProgressPercentage(reading, progressMap);
  }, [reading, progressMap]);

  const stats = useMemo(() => {
    return calculateStats(favorites, progressMap);
  }, [favorites, progressMap, statsUpdateTrigger]);

  const openChallengeModal = useCallback(() => {
    setTempGoal(challengeGoal ? String(challengeGoal) : '');
    modalHandlers.openChallenge();
  }, [challengeGoal, modalHandlers]);

  const saveChallengeGoal = useCallback(async () => {
    const goal = parseInt(tempGoal, 10);
    if (isNaN(goal) || goal <= 0) {
      Alert.alert('Objetivo no válido', 'Introduce un número de libros mayor que 0.');
      return;
    }

    try {
      // saves in backend and local storage
      await setReadingChallenge(userId, goal, year, token);

      setChallengeGoal(goal);
      await saveUserData(userId, { challengeGoal: goal });
      modalHandlers.closeChallenge();
      setTempGoal('');

      Alert.alert('Éxito', 'Objetivo de lectura guardado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el objetivo. Inténtalo de nuevo.');
    }
  }, [tempGoal, userId, year, token, modalHandlers]);

  const openBookDetails = useCallback(
    (book) => {
      const key = getBookKey(book);
      navigation?.navigate?.('BookDetail', { bookKey: key, book });
    },
    [navigation],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const libraryData = await loadLibraryData(userId, token);
      setFavorites(libraryData.favorites);
      setRecommendations(libraryData.recommendations);

      if (reading && libraryData.favorites.every((f) => f.id !== reading.id)) {
        setReading(null);
        await saveUserData(userId, { reading: null });
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, [userId, token, reading]);

  const containerStyle = [baseStyles.container, getContainerStyle()];
  const scrollStyle = [baseStyles.scroll, getScrollStyle()];

  return (
    <View style={containerStyle}>
      <View style={libraryStyles.backgroundDecoration} />
      <ScrollView
        contentContainerStyle={scrollStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.ACCENT]}
            tintColor={COLORS.ACCENT}
            title="Actualizando..."
            titleColor={COLORS.ACCENT}
          />
        }
      >
        <Header
          greeting="Mi Biblioteca"
          user={null}
          onProfilePress={() => navigation?.navigate?.('Perfil')}
        />

        <View style={libraryStyles.card}>
          <View style={libraryStyles.sectionHeader}>
            <View style={libraryStyles.titleWrap}>
              <Text style={libraryStyles.sectionTitle}>Actualmente leyendo</Text>
              {reading ? (
                <Text style={libraryStyles.sectionSubtitle}>
                  {(() => {
                    const progress = progressMap[reading.id];
                    if (progress?.totalPages) {
                      const pct = readingProgressPercent ?? 0;
                      const read = progress.pagesRead ?? 0;
                      return `${pct}% · ${read}/${progress.totalPages} páginas`;
                    }
                    return 'Páginas no definidas';
                  })()}
                </Text>
              ) : (
                <Text style={libraryStyles.sectionSubtitle}>Elige un libro para empezar</Text>
              )}
            </View>

            {reading ? (
              <View style={libraryStyles.chipsRow}>
                <TouchableOpacity
                  style={libraryStyles.chipPrimary}
                  onPress={() => setPickerVisible(true)}
                >
                  <Text style={libraryStyles.chipPrimaryText}>Cambiar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={libraryStyles.chipLight} onPress={openProgressModal}>
                  <Text style={libraryStyles.chipLightText}>Progreso</Text>
                </TouchableOpacity>
                <TouchableOpacity style={libraryStyles.chipLight} onPress={clearReading}>
                  <Text style={libraryStyles.chipLightText}>Quitar</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {reading ? (
            <CurrentlyReadingCard
              title={reading.title}
              author={reading.author}
              coverUri={reading?.image || null}
              progress={readingProgressPercent}
            />
          ) : (
            <View style={libraryStyles.emptyReading}>
              <Text style={libraryStyles.subtitle}>No estás leyendo ningún libro ahora mismo.</Text>
              <TouchableOpacity
                style={libraryStyles.ctaButton}
                onPress={() => setPickerVisible(true)}
              >
                <Text style={libraryStyles.ctaButtonText}>Elegir de favoritos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={libraryStyles.card}>
          {statsLoading ? (
            <View style={libraryStyles.loadingContainer}>
              <ActivityIndicator size="small" color="#5A4FFF" />
              <Text style={libraryStyles.loadingText}>Cargando estadísticas...</Text>
            </View>
          ) : (
            <StatsRow stats={stats} />
          )}
        </View>

        <View style={libraryStyles.card}>
          <Text style={libraryStyles.sectionTitle}>Recomendados para ti</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#5A4FFF" />
          ) : (
            <BookCarousel
              title=""
              titleStyle={libraryStyles.title}
              bookTitleStyle={libraryStyles.subtitle}
              authorStyle={libraryStyles.subtitle}
              books={recommendations || []}
              onSeeAll={() => navigation?.navigate?.('Explore')}
              onPressBook={openBookDetails}
              showSeeAll={(recommendations || []).length > 6}
            />
          )}
        </View>

        <View style={libraryStyles.card}>
          <View style={libraryStyles.rowBetween}>
            <Text style={libraryStyles.sectionTitle}>Mis favoritos</Text>
          </View>
          {favorites.length === 0 ? (
            <Text style={libraryStyles.subtitle}>No tienes libros favoritos.</Text>
          ) : (
            <FlatList
              data={favorites}
              horizontal
              keyExtractor={(item) => item.id?.toString() || item.key || item.title}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={() => chooseReading(item)}
                    onPress={() => openBookDetails(item)}
                  >
                    <BookCard
                      {...item}
                      isFavorite
                      onToggleFavorite={() => handleToggleFavorite(item)}
                    />
                  </TouchableOpacity>
                );
              }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={libraryStyles.favList}
            />
          )}
        </View>

        <View style={libraryStyles.card}>
          <View style={libraryStyles.rowBetween}>
            <Text style={libraryStyles.sectionTitle}>Reto de lectura {year}</Text>
            <TouchableOpacity style={libraryStyles.chipLight} onPress={openChallengeModal}>
              <Text style={libraryStyles.chipLightText}>
                {challengeGoal ? 'Cambiar' : 'Establecer'}
              </Text>
            </TouchableOpacity>
          </View>
          <ReadingChallenge
            title={
              challengeGoal
                ? `Reto: leer ${challengeGoal} libros en ${year}`
                : `Define tu objetivo de ${year}`
            }
            titleStyle={libraryStyles.title}
            current={stats.read}
            total={challengeGoal || 1}
          />
        </View>

        <View style={libraryStyles.lastCard}>
          <View style={libraryStyles.rowBetween}>
            <View style={libraryStyles.sectionTitleContainer}>
              <Ionicons name="trophy" size={20} color={COLORS.PRIMARY} />
              <Text style={libraryStyles.sectionTitle}>Logros recientes</Text>
            </View>
            <TouchableOpacity
              style={libraryStyles.viewAllButton}
              onPress={() => navigation.navigate('Achievements')}
            >
              <Text style={libraryStyles.viewAllText}>Ver todos</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>

          {!achievements?.achievements || achievements.achievements.length === 0 ? (
            <View style={libraryStyles.emptyAchievements}>
              <Ionicons name="trophy" size={32} color="#D1D5DB" />
              <Text style={libraryStyles.emptyText}>
                ¡Comienza a leer para desbloquear tu primer logro!
              </Text>
            </View>
          ) : (
            <View style={libraryStyles.achievementsPreview}>
              {achievements.achievements
                .filter((achievement) => achievement.unlockedAt)
                .slice(-3)
                .map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={true}
                    size="small"
                  />
                ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={libraryStyles.modalBackdrop}>
          <View style={libraryStyles.modalSheet}>
            <Text style={libraryStyles.modalTitle}>Elige un libro</Text>
            {favorites.length === 0 ? (
              <Text style={libraryStyles.subtitle}>No hay favoritos disponibles.</Text>
            ) : (
              <FlatList
                data={favorites}
                keyExtractor={(item) => item.id?.toString() || item.key || item.title}
                ItemSeparatorComponent={() => <View style={libraryStyles.separator} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={libraryStyles.pickerItem}
                    onPress={() => chooseReading(item)}
                  >
                    <Image source={{ uri: item.image }} style={libraryStyles.pickerCover} />
                    <View style={{ flex: 1 }}>
                      <Text style={libraryStyles.pickerTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={libraryStyles.pickerAuthor} numberOfLines={1}>
                        {item.author || 'Desconocido'}
                      </Text>
                    </View>
                    <Text style={libraryStyles.pickerAction}>Seleccionar</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              style={libraryStyles.modalClose}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={libraryStyles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={pagesModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPagesModalVisible(false)}
      >
        <View style={libraryStyles.modalBackdropCenter}>
          <View style={libraryStyles.modalCard}>
            <Text style={libraryStyles.modalTitle}>Páginas totales</Text>
            <TextInput
              style={libraryStyles.input}
              value={tempPages}
              onChangeText={setTempPages}
              placeholder="Introduce el número de páginas"
              keyboardType="number-pad"
            />
            <View style={libraryStyles.rowEnd}>
              <TouchableOpacity
                style={libraryStyles.modalCloseTiny}
                onPress={() => setPagesModalVisible(false)}
              >
                <Text style={libraryStyles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={libraryStyles.modalPrimaryTiny} onPress={saveTotalPages}>
                <Text style={libraryStyles.modalPrimaryText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={progressModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProgressModalVisible(false)}
      >
        <View style={libraryStyles.modalBackdropCenter}>
          <View style={libraryStyles.modalCard}>
            <Text style={libraryStyles.modalTitle}>Actualizar progreso</Text>
            <Text style={libraryStyles.inputLabel}>Porcentaje</Text>
            <TextInput
              style={libraryStyles.input}
              value={tempPercent}
              onChangeText={setTempPercent}
              placeholder="0 - 100"
              keyboardType="number-pad"
            />
            <Text style={libraryStyles.orText}>o</Text>
            <Text style={libraryStyles.inputLabel}>Página actual</Text>
            <TextInput
              style={libraryStyles.input}
              value={tempPage}
              onChangeText={setTempPage}
              placeholder="Número de página"
              keyboardType="number-pad"
            />
            <View style={libraryStyles.rowEnd}>
              <TouchableOpacity
                style={libraryStyles.modalCloseTiny}
                onPress={() => setProgressModalVisible(false)}
              >
                <Text style={libraryStyles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={libraryStyles.modalPrimaryTiny} onPress={saveProgress}>
                <Text style={libraryStyles.modalPrimaryText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={challengeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setChallengeModalVisible(false)}
      >
        <View style={libraryStyles.modalBackdropCenter}>
          <View style={libraryStyles.modalCard}>
            <Text style={libraryStyles.modalTitle}>Objetivo de lectura {year}</Text>
            <TextInput
              style={libraryStyles.input}
              value={tempGoal}
              onChangeText={setTempGoal}
              placeholder="Libros a leer"
              keyboardType="number-pad"
            />
            <View style={libraryStyles.rowEnd}>
              <TouchableOpacity
                style={libraryStyles.modalCloseTiny}
                onPress={() => setChallengeModalVisible(false)}
              >
                <Text style={libraryStyles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={libraryStyles.modalPrimaryTiny} onPress={saveChallengeGoal}>
                <Text style={libraryStyles.modalPrimaryText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AchievementNotification
        achievement={currentNotification}
        visible={notificationVisible}
        onClose={handleNotificationClose}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </View>
  );
}
