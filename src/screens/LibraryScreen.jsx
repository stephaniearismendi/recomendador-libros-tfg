import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

export default function LibraryScreen() {
  const navigation = useNavigation();
  const { token, user } = useContext(AuthContext);
  const { getContainerStyle, getScrollStyle } = useCustomSafeArea();
  const year = new Date().getFullYear();
  const userId = user?.id || null;

  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reading, setReading] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pagesModalVisible, setPagesModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [tempPages, setTempPages] = useState('');
  const [tempPercent, setTempPercent] = useState('');
  const [tempPage, setTempPage] = useState('');
  const [challengeGoal, setChallengeGoal] = useState(null);
  const [tempGoal, setTempGoal] = useState('');

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const userData = await loadUserData(userId);
      setReading(userData.reading);
      setProgressMap(userData.progressMap);
      setChallengeGoal(userData.challengeGoal);
    })();
  }, [userId]);

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

          if (reading && libraryData.favorites.every(f => f.id !== reading.id)) {
            if (isActive) {
              setReading(null);
              await saveUserData(userId, { reading: null });
            }
          }
        } catch (error) {
          console.error('Error al cargar datos:', error);
        } finally {
          if (isActive) setLoading(false);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [userId, token, reading])
  );

  const persistProgress = useCallback(async (next) => {
    setProgressMap(next);
    await saveUserData(userId, { progressMap: next });
  }, [userId]);

  const handleToggleFavorite = useCallback(async (book) => {
    const result = await toggleFavorite(book, favorites, userId, token);
    setFavorites(result.favorites);
    setRecommendations(result.recommendations);
    
    if (reading && reading.id === book.id && !result.favorites.some(f => f.id === book.id)) {
      setReading(null);
      await saveUserData(userId, { reading: null });
    }
  }, [favorites, reading, token, userId]);

  const chooseReading = useCallback(async (book) => {
    setReading(book);
    await saveUserData(userId, { reading: book });
    const progress = progressMap[book.id];
    if (!progress || !progress.totalPages) {
      setTempPages('');
      setPagesModalVisible(true);
    }
    setPickerVisible(false);
  }, [progressMap, userId]);

  const clearReading = useCallback(async () => {
    setReading(null);
    await saveUserData(userId, { reading: null });
  }, [userId]);

  const saveTotalPages = useCallback(async () => {
    const total = parseInt(tempPages, 10);
    if (!reading || isNaN(total) || total <= 0) return;
    const next = updateProgress(progressMap, reading.id, { totalPages: total });
    await persistProgress(next);
    setPagesModalVisible(false);
    setTempPages('');
  }, [reading, tempPages, progressMap, persistProgress]);

  const openProgressModal = useCallback(() => {
    if (!reading) return;
    const progress = progressMap[reading.id];
    const total = progress?.totalPages || 0;
    const pagesRead = progress?.pagesRead || 0;
    const percent = total > 0 ? Math.round((pagesRead / total) * 100) : 0;
    setTempPercent(percent ? String(percent) : '');
    setTempPage(pagesRead ? String(pagesRead) : '');
    setProgressModalVisible(true);
  }, [reading, progressMap]);

  const saveProgress = useCallback(async () => {
    if (!reading) return;
    const current = progressMap[reading.id] || { totalPages: 0, pagesRead: 0 };
    const total = current.totalPages || 0;
    const pagesRead = validateProgressInput(tempPercent, tempPage, total);
    if (pagesRead === null) return;
    
    const next = updateProgress(progressMap, reading.id, { pagesRead });
    await persistProgress(next);
    setProgressModalVisible(false);
    setTempPercent('');
    setTempPage('');
    
    if (total > 0 && pagesRead >= total) {
      setReading(null);
      await saveUserData(userId, { reading: null });
    }
  }, [reading, tempPercent, tempPage, progressMap, persistProgress, userId]);

  const readingProgressPercent = useMemo(() => {
    return calculateProgressPercentage(reading, progressMap);
  }, [reading, progressMap]);

  const stats = useMemo(() => {
    return calculateStats(favorites, progressMap);
  }, [favorites, progressMap]);

  const openChallengeModal = useCallback(() => {
    setTempGoal(challengeGoal ? String(challengeGoal) : '');
    setChallengeModalVisible(true);
  }, [challengeGoal]);

  const saveChallengeGoal = useCallback(async () => {
    const goal = parseInt(tempGoal, 10);
    if (isNaN(goal) || goal <= 0) {
      Alert.alert('Objetivo no válido', 'Introduce un número de libros mayor que 0.');
      return;
    }
    setChallengeGoal(goal);
    await saveUserData(userId, { challengeGoal: goal });
    setChallengeModalVisible(false);
    setTempGoal('');
  }, [tempGoal, userId]);

  const openBookDetails = useCallback((book) => {
    const key = getBookKey(book);
    navigation?.navigate?.('BookDetail', { bookKey: key, book });
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const libraryData = await loadLibraryData(userId, token);
      setFavorites(libraryData.favorites);
      setRecommendations(libraryData.recommendations);

      if (reading && libraryData.favorites.every(f => f.id !== reading.id)) {
        setReading(null);
        await saveUserData(userId, { reading: null });
      }
    } catch (error) {
      console.error('Error al refrescar:', error);
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
                <TouchableOpacity style={libraryStyles.chipPrimary} onPress={() => setPickerVisible(true)}>
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
              <TouchableOpacity style={libraryStyles.ctaButton} onPress={() => setPickerVisible(true)}>
                <Text style={libraryStyles.ctaButtonText}>Elegir de favoritos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={libraryStyles.card}>
          <StatsRow stats={stats} />
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

        <View style={libraryStyles.lastCard}>
          <View style={libraryStyles.rowBetween}>
            <Text style={libraryStyles.sectionTitle}>Reto de lectura {year}</Text>
            <TouchableOpacity style={libraryStyles.chipLight} onPress={openChallengeModal}>
              <Text style={libraryStyles.chipLightText}>{challengeGoal ? 'Cambiar' : 'Establecer'}</Text>
            </TouchableOpacity>
          </View>
          <ReadingChallenge
            title={challengeGoal ? `Reto: leer ${challengeGoal} libros en ${year}` : `Define tu objetivo de ${year}`}
            titleStyle={libraryStyles.title}
            current={stats.read}
            total={challengeGoal || 1}
          />
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
                      <Text style={libraryStyles.pickerTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={libraryStyles.pickerAuthor} numberOfLines={1}>{item.author || 'Desconocido'}</Text>
                    </View>
                    <Text style={libraryStyles.pickerAction}>Seleccionar</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={libraryStyles.modalClose} onPress={() => setPickerVisible(false)}>
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
              <TouchableOpacity style={libraryStyles.modalCloseTiny} onPress={() => setPagesModalVisible(false)}>
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
              <TouchableOpacity style={libraryStyles.modalCloseTiny} onPress={() => setProgressModalVisible(false)}>
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
              <TouchableOpacity style={libraryStyles.modalCloseTiny} onPress={() => setChallengeModalVisible(false)}>
                <Text style={libraryStyles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={libraryStyles.modalPrimaryTiny} onPress={saveChallengeGoal}>
                <Text style={libraryStyles.modalPrimaryText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}