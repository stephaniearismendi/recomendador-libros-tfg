import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View,
  Text,
  Image,
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
} from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { bookDetailStyles } from '../styles/components';
import { 
  canonicalId, 
  resolveCoverUri, 
  getBookRating, 
  isBookComplete 
} from '../utils/bookDetailUtils';

export default function BookDetailScreen({ route }) {
  const { book, bookKey } = route.params;
  const navigation = useNavigation();
  const { token, user } = useContext(AuthContext);

  const [details, setDetails] = useState({ description: '', rating: null, image: null });
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const userId = user?.id || null;
  const finalRating = useMemo(() => getBookRating(details, book), [details, book]);
  const coverUri = useMemo(() => resolveCoverUri(book, details), [book, details]);


  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (isBookComplete(book)) {
          setDetails(book);
          setLoading(false);
          return;
        }

        const key = canonicalId(book?.id) || canonicalId(bookKey) || book?.key;
        if (!key) {
          setDetails(book || {});
          setLoading(false);
          return;
        }

        try {
          const dbResponse = await getBookById(key);
          if (dbResponse.data) {
            setDetails(dbResponse.data);
            setLoading(false);
            return;
          }
        } catch (dbError) {
          // Continue to external API
        }

        const response = await getBookDetails(key);
        setDetails(response.data || {});
      } catch (error) {
        setDetails(book || {});
      } finally {
        setLoading(false);
      }
    })();
  }, [book?.id, bookKey, book]);

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
        [{ text: 'OK' }]
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
          { ...book, ...details, image: coverUri, imageUrl: coverUri },
          token,
        );
        setIsFavorite(true);
      }
    } catch (err) {
      Alert.alert('Error', `No se pudo actualizar favoritos: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <SafeAreaView style={bookDetailStyles.safe}>
      <ScrollView contentContainerStyle={bookDetailStyles.container}>
        <TouchableOpacity style={bookDetailStyles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#3b5998" />
        </TouchableOpacity>

        <Image source={{ uri: coverUri }} style={bookDetailStyles.cover} />
        <Text style={bookDetailStyles.title}>{book.title}</Text>
        <Text style={bookDetailStyles.author}>por {book.author || 'Desconocido'}</Text>

        {!loading && finalRating && (
          <View style={bookDetailStyles.ratingRow}>
            <MaterialIcons
              name={isNaN(Number(finalRating)) ? 'trending-up' : 'star'}
              size={20}
              color={isNaN(Number(finalRating)) ? '#6366F1' : '#FFD700'}
            />
            <Text style={bookDetailStyles.ratingText}>{finalRating}</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="small" color="#888" />
        ) : (
          <Text style={bookDetailStyles.description}>
            {details.description || 'No hay descripción disponible.'}
          </Text>
        )}

        <TouchableOpacity style={bookDetailStyles.favButton} onPress={handleToggleFavorite}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={22}
            color="#e63946"
          />
          <Text style={bookDetailStyles.favButtonText}>
            {isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

