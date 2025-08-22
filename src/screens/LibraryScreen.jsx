import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
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
} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useFocusEffect } from '@react-navigation/native';

const READING_KEY = 'current_reading';
const PROGRESS_KEY = 'progress_map';
const CHALLENGE_KEY = 'reading_challenge_goal';
const FALLBACK_IMG = 'https://covers.openlibrary.org/b/id/240727-S.jpg';

function coverUriFromBook(book) {
  const str = typeof book?.image === 'string' ? book.image : null;
  const obj = typeof book?.image === 'object' && book?.image?.uri ? book.image.uri : null;
  const direct = str || obj || book?.cover || book?.coverUrl;
  if (direct) return direct;
  if (book?.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  if (Array.isArray(book?.isbn) && book.isbn.length > 0) return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
  if (book?.title) return `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-M.jpg`;
  return FALLBACK_IMG;
}

export default function LibraryScreen() {
  const year = new Date().getFullYear();

  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reading, setReading] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

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
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded?.userId || null);
        }
      } catch {}
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadLocal = async () => {
      if (!userId) return;
      const r = await AsyncStorage.getItem(`${READING_KEY}:${userId}`);
      setReading(r ? JSON.parse(r) : null);
      const p = await AsyncStorage.getItem(`${PROGRESS_KEY}:${userId}`);
      setProgressMap(p ? JSON.parse(p) : {});
      const g = await AsyncStorage.getItem(`${CHALLENGE_KEY}:${userId}:${year}`);
      setChallengeGoal(g ? parseInt(g, 10) : null);
    };
    loadLocal();
  }, [userId, year]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      const loadData = async () => {
        setLoading(true);
        try {
          const [favRes, recRes] = await Promise.all([
            getFavorites(userId),
            getPopularBooks(),
          ]);
          const favs = favRes?.data || [];
          setFavorites(favs);
          setRecommendations((recRes?.data || []).slice(0, 6));
          if (reading && favs.every(f => f.id !== reading.id)) {
            setReading(null);
            await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
          }
        } catch {} finally {
          setLoading(false);
        }
      };
      loadData();
    }, [userId, reading])
  );

  const persistProgress = async (next) => {
    setProgressMap(next);
    await AsyncStorage.setItem(`${PROGRESS_KEY}:${userId}`, JSON.stringify(next));
  };

  const toggleFavorite = async (book) => {
    try {
      if (favorites.some(fav => fav.id === book.id)) {
        await removeFavorite(userId, book.id);
        if (reading && reading.id === book.id) {
          setReading(null);
          await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
        }
      } else {
        await addFavorite(userId, book);
      }
      const favRes = await getFavorites(userId);
      setFavorites(favRes.data || []);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const chooseReading = async (book) => {
    setReading(book);
    await AsyncStorage.setItem(`${READING_KEY}:${userId}`, JSON.stringify(book));
    const p = progressMap[book.id];
    if (!p || !p.totalPages) {
      setTempPages('');
      setPagesModalVisible(true);
    }
    setPickerVisible(false);
  };

  const clearReading = async () => {
    setReading(null);
    await AsyncStorage.removeItem(`${READING_KEY}:${userId}`);
  };

  const saveTotalPages = async () => {
    const total = parseInt(tempPages, 10);
    if (!reading || isNaN(total) || total <= 0) return;
    const prev = progressMap[reading.id] || { totalPages: 0, pagesRead: 0 };
    const next = { ...progressMap, [reading.id]: { ...prev, totalPages: total } };
    await persistProgress(next);
    setPagesModalVisible(false);
    setTempPages('');
  };

  const openProgressModal = () => {
    if (!reading) return;
    const p = progressMap[reading.id];
    const total = p?.totalPages || 0;
    const pagesRead = p?.pagesRead || 0;
    const percent = total > 0 ? Math.round((pagesRead / total) * 100) : 0;
    setTempPercent(percent ? String(percent) : '');
    setTempPage(pagesRead ? String(pagesRead) : '');
    setProgressModalVisible(true);
  };

  const saveProgress = async () => {
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
  };

  const readingProgressPercent = (() => {
    if (!reading) return 0;
    const p = progressMap[reading.id];
    if (!p || !p.totalPages) return 0;
    return Math.max(0, Math.min(100, Math.round((p.pagesRead / p.totalPages) * 100)));
  })();

  const stats = (() => {
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
  })();

  const currentCover = reading ? coverUriFromBook(reading) : null;

  const openChallengeModal = () => {
    setTempGoal(challengeGoal ? String(challengeGoal) : '');
    setChallengeModalVisible(true);
  };

  const saveChallengeGoal = async () => {
    const g = parseInt(tempGoal, 10);
    if (isNaN(g) || g <= 0) {
      Alert.alert('Objetivo no válido', 'Introduce un número de libros mayor que 0.');
      return;
    }
    setChallengeGoal(g);
    await AsyncStorage.setItem(`${CHALLENGE_KEY}:${userId}:${year}`, String(g));
    setChallengeModalVisible(false);
    setTempGoal('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header greeting="¡Hola!" greetingStyle={styles.greeting} />

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
                      return `${pct}% · ${read}/${p.totalPages} pág.`;
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
              books={(recommendations || []).map((book) => ({
                ...book,
                image: { uri: coverUriFromBook(book) },
              }))}
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
              keyExtractor={item => item.id?.toString() || item.title}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.9} onLongPress={() => chooseReading(item)}>
                  <BookCard
                    {...item}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(item)}
                  />
                </TouchableOpacity>
              )}
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
                keyExtractor={(item) => item.id?.toString() || item.title}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => chooseReading(item)}
                  >
                    <Image source={{ uri: coverUriFromBook(item) }} style={styles.pickerCover} />
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
