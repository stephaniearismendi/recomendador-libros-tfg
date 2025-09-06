import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Text,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import CurrentlyReadingCard from '../components/CurrentlyReadingCard';
import StatsRow from '../components/StatsRow';
import BookCarousel from '../components/BookCarousel';
import ReadingChallenge from '../components/ReadingChallenge';
import BookCard from '../components/BookCard';
import styles from '../styles/libraryStyles';
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

// Las funciones coverUriFromBook y withResolvedCover se removieron
// porque los libros ya vienen con imagen de la base de datos

export default function LibraryScreen() {
  const navigation = useNavigation();
  const year = new Date().getFullYear();

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
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
      const t = await AsyncStorage.getItem('token');
      if (!t) return;
      setToken(t);
      try {
        const decoded = jwtDecode(t);
        setUserId(decoded?.userId || null);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const r = await AsyncStorage.getItem(`${READING_KEY}:${userId}`);
      setReading(r ? JSON.parse(r) : null);
      const p = await AsyncStorage.getItem(`${PROGRESS_KEY}:${userId}`);
      setProgressMap(p ? JSON.parse(p) : {});
      const g = await AsyncStorage.getItem(`${CHALLENGE_KEY}:${userId}:${year}`);
      setChallengeGoal(g ? parseInt(g, 10) : null);
    })();
  }, [userId, year]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        setLoading(true);
        try {
          // --- favoritos
          let favs = [];
          if (userId && token) {
            const favRes = await getFavorites(userId, token);
            favs = favRes?.data || [];
          }
          if (isActive) setFavorites(favs);

          // --- recomendaciones
          let recs = [];
          try {
            if (userId && token) {
              const recRes = await getPersonalRecommendations({ userId }, token);
              recs = recRes?.data || [];
            } else {
              const popRes = await getPopularBooks();
              recs = popRes?.data || [];
            }
          } catch {
            const popRes = await getPopularBooks();
            recs = popRes?.data || [];
          }
          
          if (isActive) setRecommendations(recs.slice(0, 6));

          // si el "reading" ya no está en favoritos, límpialo
          if (reading && favs.every(f => f.id !== reading.id)) {
            if (isActive) setReading(null);
            await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
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
    await AsyncStorage.setItem(`${PROGRESS_KEY}:${userId}`, JSON.stringify(next));
  }, [userId]);

  const toggleFavorite = useCallback(async (book) => {
    try {
      if (!userId || !token) {
        Alert.alert('Sesión requerida', 'Inicia sesión para gestionar favoritos.');
        return;
      }
      if (favorites.some(fav => fav.id === book.id)) {
        await removeFavorite(userId, book.id, token);
        if (reading && reading.id === book.id) {
          setReading(null);
          await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
        }
      } else {
        await addFavorite(userId, book, token);
      }
      // refresca favoritos
      const favRes = await getFavorites(userId, token);
      setFavorites(favRes.data || []);  // Los libros ya vienen con imagen de la BD
      try {
        const recRes = await getPersonalRecommendations({ userId }, token);
        setRecommendations((recRes?.data || []).slice(0, 6));
      } catch {}
    } catch (err) {
      console.error('FAVORITE ERROR (LibraryScreen):', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method
        }
      });
      Alert.alert('Error', `No se pudo actualizar favoritos: ${err.response?.data?.error || err.message}`);
    }
  }, [favorites, reading, token, userId]);

  const chooseReading = useCallback(async (book) => {
    setReading(book);
    await AsyncStorage.setItem(`${READING_KEY}:${userId}`, JSON.stringify(book));
    const p = progressMap[book.id];
    if (!p || !p.totalPages) {
      setTempPages('');
      setPagesModalVisible(true);
    }
    setPickerVisible(false);
  }, [progressMap, userId]);

  const clearReading = useCallback(async () => {
    setReading(null);
    await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
  }, [userId]);

  const saveTotalPages = useCallback(async () => {
    const total = parseInt(tempPages, 10);
    if (!reading || isNaN(total) || total <= 0) return;
    const prev = progressMap[reading.id] || { totalPages: 0, pagesRead: 0 };
    const next = { ...progressMap, [reading.id]: { ...prev, totalPages: total } };
    await persistProgress(next);
    setPagesModalVisible(false);
    setTempPages('');
  }, [reading, tempPages, progressMap, persistProgress]);

  const openProgressModal = useCallback(() => {
    if (!reading) return;
    const p = progressMap[reading.id];
    const total = p?.totalPages || 0;
    const pagesRead = p?.pagesRead || 0;
    const percent = total > 0 ? Math.round((pagesRead / total) * 100) : 0;
    setTempPercent(percent ? String(percent) : '');
    setTempPage(pagesRead ? String(pagesRead) : '');
    setProgressModalVisible(true);
  }, [reading, progressMap]);

  const saveProgress = useCallback(async () => {
    if (!reading) return;
    const current = progressMap[reading.id] || { totalPages: 0, pagesRead: 0 };
    const total = current.totalPages || 0;
    const hasPercent = tempPercent.trim() !== '' && !isNaN(parseInt(tempPercent, 10));
    const hasPage = tempPage.trim() !== '' && !isNaN(parseInt(tempPage, 10));
    if (!hasPercent && !hasPage) return;
    let pagesRead = current.pagesRead || 0;
    if (hasPercent) {
      const pct = Math.max(0, Math.min(100, parseInt(tempPercent, 10)));
      pagesRead = total > 0 ? Math.round((pct / 100) * total) : 0;
    } else if (hasPage) {
      const val = Math.max(0, parseInt(tempPage, 10));
      pagesRead = total > 0 ? Math.min(val, total) : val;
    }
    const next = { ...progressMap, [reading.id]: { totalPages: total, pagesRead } };
    await persistProgress(next);
    setProgressModalVisible(false);
    setTempPercent('');
    setTempPage('');
    if (total > 0 && pagesRead >= total) {
      setReading(null);
      await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
    }
  }, [reading, tempPercent, tempPage, progressMap, persistProgress, userId]);

  const readingProgressPercent = useMemo(() => {
    if (!reading) return 0;
    const p = progressMap[reading.id];
    if (!p || !p.totalPages) return 0;
    return Math.max(0, Math.min(100, Math.round((p.pagesRead / p.totalPages) * 100)));
  }, [reading, progressMap]);

  const stats = useMemo(() => {
    const read = favorites.filter(b => {
      const p = progressMap[b.id];
      return p && p.totalPages && p.pagesRead >= p.totalPages;
    }).length;
    const inProgress = favorites.filter(b => {
      const p = progressMap[b.id];
      return p && p.totalPages && p.pagesRead > 0 && p.pagesRead < p.totalPages;
    }).length;
    const toRead = favorites.filter(b => {
      const p = progressMap[b.id];
      return !p || !p.pagesRead || p.pagesRead === 0;
    }).length;
    return { read, inProgress, toRead };
  }, [favorites, progressMap]);

  const currentCover = reading?.image || null;

  const openChallengeModal = useCallback(() => {
    setTempGoal(challengeGoal ? String(challengeGoal) : '');
    setChallengeModalVisible(true);
  }, [challengeGoal]);

  const saveChallengeGoal = useCallback(async () => {
    const g = parseInt(tempGoal, 10);
    if (isNaN(g) || g <= 0) {
      Alert.alert('Objetivo no válido', 'Introduce un número de libros mayor que 0.');
      return;
    }
    setChallengeGoal(g);
    await AsyncStorage.setItem(`${CHALLENGE_KEY}:${userId}:${year}`, String(g));
    setChallengeModalVisible(false);
    setTempGoal('');
  }, [tempGoal, userId, year]);

  const openBookDetails = useCallback((book) => {
    const key = book?.key || book?.id || book?.olid || book?.workId;
    navigation?.navigate?.('BookDetail', { bookKey: key, book });
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // --- favoritos
      let favs = [];
      if (userId && token) {
        const favRes = await getFavorites(userId, token);
        favs = favRes?.data || [];
      }
      setFavorites(favs);

      // --- recomendaciones
      let recs = [];
      try {
        if (userId && token) {
          const recRes = await getPersonalRecommendations({ userId }, token);
          recs = recRes?.data || [];
        } else {
          const popRes = await getPopularBooks();
          recs = popRes?.data || [];
        }
      } catch {
        const popRes = await getPopularBooks();
        recs = popRes?.data || [];
      }
      
      setRecommendations(recs.slice(0, 6));

      // si el "reading" ya no está en favoritos, límpialo
      if (reading && favs.every(f => f.id !== reading.id)) {
        setReading(null);
        await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
      }
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setRefreshing(false);
    }
  }, [userId, token, reading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundDecoration} />
      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5A4FFF']} // Android
            tintColor="#5A4FFF" // iOS
            title="Actualizando..." // iOS
            titleColor="#5A4FFF" // iOS
          />
        }
      >
        <Header 
          greeting="Mi Biblioteca" 
          user={null} // Se obtendrá del AuthContext
          onProfilePress={() => navigation?.navigate?.('Profile')}
        />

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWrap}>
              <Text style={styles.sectionTitle}>Actualmente leyendo</Text>
              {reading ? (
                <Text style={styles.sectionSubtitle}>
                  {(() => {
                    const p = progressMap[reading.id];
                    if (p?.totalPages) {
                      const pct = readingProgressPercent ?? 0;
                      const read = p.pagesRead ?? 0;
                      return `${pct}% · ${read}/${p.totalPages} páginas`;
                    }
                    return 'Páginas no definidas';
                  })()}
                </Text>
              ) : (
                <Text style={styles.sectionSubtitle}>Elige un libro para empezar</Text>
              )}
            </View>

            {reading ? (
              <View style={styles.chipsRow}>
                <TouchableOpacity style={styles.chipPrimary} onPress={() => setPickerVisible(true)}>
                  <Text style={styles.chipPrimaryText}>Cambiar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chipLight} onPress={openProgressModal}>
                  <Text style={styles.chipLightText}>Progreso</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chipLight} onPress={clearReading}>
                  <Text style={styles.chipLightText}>Quitar</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {reading ? (
            <CurrentlyReadingCard
              title={reading.title}
              author={reading.author}
              coverUri={currentCover}
              progress={readingProgressPercent}
            />
          ) : (
            <View style={styles.emptyReading}>
              <Text style={styles.subtitle}>No estás leyendo ningún libro ahora mismo.</Text>
              <TouchableOpacity style={styles.ctaButton} onPress={() => setPickerVisible(true)}>
                <Text style={styles.ctaButtonText}>Elegir de favoritos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <StatsRow stats={stats} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recomendados para ti</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#5A4FFF" />
          ) : (
            <BookCarousel
              title=""
              titleStyle={styles.title}
              bookTitleStyle={styles.subtitle}
              authorStyle={styles.subtitle}
              books={recommendations || []}  // Los libros ya vienen con imagen de la BD
              onSeeAll={() => navigation?.navigate?.('Explore')}
              onPressBook={openBookDetails}
              showSeeAll={(recommendations || []).length > 6}
            />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Mis favoritos</Text>
          </View>
          {favorites.length === 0 ? (
            <Text style={styles.subtitle}>No tienes libros favoritos.</Text>
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
                      onToggleFavorite={() => toggleFavorite(item)}
                    />
                  </TouchableOpacity>
                );
              }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favList}
            />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Reto de lectura {year}</Text>
            <TouchableOpacity style={styles.chipLight} onPress={openChallengeModal}>
              <Text style={styles.chipLightText}>{challengeGoal ? 'Cambiar' : 'Establecer'}</Text>
            </TouchableOpacity>
          </View>
          <ReadingChallenge
            title={challengeGoal ? `Reto: leer ${challengeGoal} libros en ${year}` : `Define tu objetivo de ${year}`}
            titleStyle={styles.title}
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
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Elige un libro</Text>
            {favorites.length === 0 ? (
              <Text style={styles.subtitle}>No hay favoritos disponibles.</Text>
            ) : (
              <FlatList
                data={favorites}
                keyExtractor={(item) => item.id?.toString() || item.key || item.title}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => chooseReading(item)}
                  >
                    <Image source={{ uri: item.image }} style={styles.pickerCover} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pickerTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.pickerAuthor} numberOfLines={1}>{item.author || 'Desconocido'}</Text>
                    </View>
                    <Text style={styles.pickerAction}>Seleccionar</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.modalClose} onPress={() => setPickerVisible(false)}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
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
        <View style={styles.modalBackdropCenter}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Páginas totales</Text>
            <TextInput
              style={styles.input}
              value={tempPages}
              onChangeText={setTempPages}
              placeholder="Introduce el número de páginas"
              keyboardType="number-pad"
            />
            <View style={styles.rowEnd}>
              <TouchableOpacity style={styles.modalCloseTiny} onPress={() => setPagesModalVisible(false)}>
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPrimaryTiny} onPress={saveTotalPages}>
                <Text style={styles.modalPrimaryText}>Guardar</Text>
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
        <View style={styles.modalBackdropCenter}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Actualizar progreso</Text>
            <Text style={styles.inputLabel}>Porcentaje</Text>
            <TextInput
              style={styles.input}
              value={tempPercent}
              onChangeText={setTempPercent}
              placeholder="0 - 100"
              keyboardType="number-pad"
            />
            <Text style={styles.orText}>o</Text>
            <Text style={styles.inputLabel}>Página actual</Text>
            <TextInput
              style={styles.input}
              value={tempPage}
              onChangeText={setTempPage}
              placeholder="Número de página"
              keyboardType="number-pad"
            />
            <View style={styles.rowEnd}>
              <TouchableOpacity style={styles.modalCloseTiny} onPress={() => setProgressModalVisible(false)}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPrimaryTiny} onPress={saveProgress}>
                <Text style={styles.modalPrimaryText}>Guardar</Text>
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
        <View style={styles.modalBackdropCenter}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Objetivo de lectura {year}</Text>
            <TextInput
              style={styles.input}
              value={tempGoal}
              onChangeText={setTempGoal}
              placeholder="Libros a leer"
              keyboardType="number-pad"
            />
            <View style={styles.rowEnd}>
              <TouchableOpacity style={styles.modalCloseTiny} onPress={() => setChallengeModalVisible(false)}>
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPrimaryTiny} onPress={saveChallengeGoal}>
                <Text style={styles.modalPrimaryText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
