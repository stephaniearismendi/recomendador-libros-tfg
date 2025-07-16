import React, { useState, useEffect } from 'react';
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
  getUserIdFromToken,
} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const navigation = useNavigation();
  const [details, setDetails] = useState({ description: '', rating: null });
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const finalRating = details.rating ?? book.rating;

  useEffect(() => {
    const fetchUser = async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) {
        setToken(t);
        try {
          const res = await getUserIdFromToken(t);
          setUserId(res.data.userId);
        } catch (err) {
          console.error('Error al obtener userId desde el token:', err);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getBookDetails(book.id);
        setDetails(response.data);
      } catch (error) {
        console.error('Error al obtener detalles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [book.id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId || !token) return;
      try {
        const favRes = await getFavorites(userId, token);
        setIsFavorite(favRes.data.some(fav => fav.id === book.id));
      } catch (err) {
        setIsFavorite(false);
      }
    };
    checkFavorite();
  }, [userId, token, book.id]);

  const handleToggleFavorite = async () => {
    if (!userId || !token) return;
    try {
      if (isFavorite) {
        await removeFavorite(userId, book.id, token);
        setIsFavorite(false);
      } else {
        await addFavorite(userId, book, token);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('FAVORITE ERROR:', err?.response?.data || err.message || err);
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };


  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#3b5998" />
        </TouchableOpacity>

        <Image source={{ uri: book.image }} style={styles.cover} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>por {book.author}</Text>

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
  safe: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
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
  cover: {
    width: 160,
    height: 230,
    borderRadius: 12,
    marginTop: 60,
    marginBottom: 18,
  },
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6366F1',
    marginLeft: 6,
  },
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
  favButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#e63946',
    marginLeft: 8,
  },
});
