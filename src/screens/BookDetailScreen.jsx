// src/screens/BookDetailScreen.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getBookDetails,
  addFavorite,
  removeFavorite,
  getFavorites,
  getBookById,
  // ❌ getUserIdFromToken  — ya no lo usamos
} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; // ✅ decodificar localmente
import { AuthContext } from '../context/AuthContext';

const FALLBACK_IMG = 'https://covers.openlibrary.org/b/id/240727-S.jpg';

// isbn helper (igual que tenías)
const firstIsbn = (b = {}) => {
  if (Array.isArray(b.isbn) && b.isbn[0]) return String(b.isbn[0]);
  if (typeof b.primary_isbn13 === 'string' && b.primary_isbn13) return b.primary_isbn13;
  if (typeof b.primary_isbn10 === 'string' && b.primary_isbn10) return b.primary_isbn10;
  if (typeof b.isbn13 === 'string' && b.isbn13) return b.isbn13;
  if (typeof b.isbn10 === 'string' && b.isbn10) return b.isbn10;
  if (Array.isArray(b.isbns) && (b.isbns[0]?.isbn13 || b.isbns[0]?.isbn10)) {
    return b.isbns[0].isbn13 || b.isbns[0].isbn10;
  }
  return null;
};

// normaliza ids tipo "/works/OL12345W" -> "OL12345W"
const canonicalId = (id) =>
  String(id ?? '')
    .replace(/^\/?works\//, '')
    .trim();

const resolveCoverUri = (book = {}, details = {}) => {
  const candidates = [
    typeof book.image === 'string' ? book.image : null,
    typeof book.image === 'object' && book.image?.uri ? book.image.uri : null,
    book.book_image || null,
    book.imageUrl || book.coverUrl || book.cover || null,
    typeof details.image === 'string' ? details.image : null,
    details.imageUrl || details.coverUrl || null,
  ].filter(Boolean);
  if (candidates.length > 0) return candidates[0];
  const isbn = firstIsbn(book) || firstIsbn(details);
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  if (book.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  const t = book.title || details.title;
  if (t) return `https://covers.openlibrary.org/b/title/${encodeURIComponent(t)}-L.jpg`;
  return FALLBACK_IMG;
};

export default function BookDetailScreen({ route }) {
  const { book, bookKey } = route.params;
  const navigation = useNavigation();
  const { token, user } = useContext(AuthContext);

  const [details, setDetails] = useState({ description: '', rating: null, image: null });
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Usar el userId del AuthContext en lugar de estado local
  const userId = user?.id || null;

  const finalRating = details.rating ?? book.rating ?? null;
  const coverUri = useMemo(() => resolveCoverUri(book, details), [book, details]);


  // Detalles del libro
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Si el libro ya tiene descripción, no necesitamos hacer llamada adicional
        if (book?.description && book?.author && book?.title) {
          console.log('📚 Libro ya tiene datos completos, usando datos existentes');
          setDetails(book);
          setLoading(false);
          return;
        }

        const key = canonicalId(book?.id) || canonicalId(bookKey) || book?.key;
        if (!key) {
          console.log('⚠️ No hay key para obtener detalles');
          setDetails(book || {});
          setLoading(false);
          return;
        }

        // Primero intentar obtener desde la base de datos
        try {
          console.log('📚 Intentando obtener libro desde base de datos:', key);
          const dbResponse = await getBookById(key);
          if (dbResponse.data) {
            console.log('✅ Libro encontrado en base de datos:', dbResponse.data);
            setDetails(dbResponse.data);
            setLoading(false);
            return;
          }
        } catch (dbError) {
          console.log('⚠️ Libro no encontrado en base de datos, intentando API externa');
        }

        // Si no está en la base de datos, usar API externa
        const response = await getBookDetails(key);
        setDetails(response.data || {});
      } catch (error) {
        console.error('Error al obtener detalles:', error);
        // Si falla la llamada, usar los datos del libro que ya tenemos
        setDetails(book || {});
      } finally {
        setLoading(false);
      }
    })();
  }, [book?.id, bookKey, book]);

  // Estado de favorito (normalizando id para comparar)
  useEffect(() => {
    (async () => {
      if (!userId || !token) return;
      try {
        const favRes = await getFavorites(userId, token);
        const favs = Array.isArray(favRes.data) ? favRes.data : [];
        const myId = canonicalId(book.id);
        setIsFavorite(favs.some((f) => canonicalId(f.id) === myId));
      } catch {
        setIsFavorite(false);
      }
    })();
  }, [userId, token, book.id]);

  const handleToggleFavorite = async () => {
    if (!userId || !token) {
      Alert.alert(
        'Sesión Requerida', 
        'No se pudo validar tu sesión. Por favor, inicia sesión nuevamente para gestionar tus favoritos.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('User acknowledged session issue');
            }
          }
        ]
      );
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFavorite(userId, book.id, token);
        setIsFavorite(false);
      } else {
        await addFavorite(
          userId,
          { ...book, image: coverUri, imageUrl: coverUri },
          token,
        );
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('FAVORITE ERROR:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      Alert.alert('Error', `No se pudo actualizar favoritos: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#3b5998" />
        </TouchableOpacity>

        <Image source={{ uri: coverUri }} style={styles.cover} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>por {book.author || 'Desconocido'}</Text>

        {!loading && finalRating && (
          <View style={styles.ratingRow}>
            <MaterialIcons
              name={isNaN(Number(finalRating)) ? 'trending-up' : 'star'}
              size={20}
              color={isNaN(Number(finalRating)) ? '#6366F1' : '#FFD700'}
            />
            <Text style={styles.ratingText}>{finalRating}</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="small" color="#888" />
        ) : (
          <Text style={styles.description}>
            {details.description || 'No hay descripción disponible.'}
          </Text>
        )}

        <TouchableOpacity style={styles.favButton} onPress={handleToggleFavorite}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={22}
            color="#e63946"
          />
          <Text style={styles.favButtonText}>
            {isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8F5' },
  container: { padding: 24, alignItems: 'center' },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  cover: { width: 160, height: 230, borderRadius: 12, marginTop: 60, marginBottom: 18 },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ratingText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: '#6366F1', marginLeft: 6 },
  description: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    elevation: 2,
    marginBottom: 40,
  },
  favButtonText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: '#e63946', marginLeft: 8 },
});
