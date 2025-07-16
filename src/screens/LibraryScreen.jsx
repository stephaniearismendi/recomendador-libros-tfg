import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Text,
  FlatList,
  Alert,
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

export default function LibraryScreen() {
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const { userId } = jwtDecode(token);
          setUserId(userId);
        }
      } catch (err) {
        console.error('Error al obtener usuario:', err);
      }
    };
    loadUser();
  }, []);

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
          setFavorites(favRes.data || []);
          setRecommendations(recRes.data.slice(0, 6));
        } catch (err) {
          console.error('Error al cargar biblioteca:', err);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [userId])
  );

  const handleToggleFavorite = async (book) => {
    try {
      if (favorites.some(fav => fav.id === book.id)) {
        await removeFavorite(userId, book.id);
      } else {
        await addFavorite(userId, book);
      }
      const favRes = await getFavorites(userId);
      setFavorites(favRes.data || []);
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const current = favorites[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header greeting="¡Hola!" greetingStyle={styles.greeting} />

        <View style={styles.currentlySection}>
          <Text style={styles.sectionTitle}>Actualmente leyendo</Text>
          {current ? (
            <CurrentlyReadingCard
              book={{
                title: current.title,
                author: current.author,
                chapter: 'Capítulo 3 de 10',
                progress: 30,
                timeLeft: '15min restantes',
                image: { uri: current.image },
              }}
              titleStyle={styles.title}
              authorStyle={styles.subtitle}
            />
          ) : (
            <Text style={styles.subtitle}>No estás leyendo ningún libro ahora mismo.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis favoritos</Text>
          {favorites.length === 0 ? (
            <Text style={styles.subtitle}>No tienes libros favoritos.</Text>
          ) : (
            <FlatList
              data={favorites}
              horizontal
              keyExtractor={item => item.id?.toString() || item.title}
              renderItem={({ item }) => (
                <BookCard
                  {...item}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4, paddingLeft: 8, paddingRight: 8 }}
            />
          )}
        </View>

        <View style={styles.section}>
          <StatsRow stats={{ read: favorites.length, time: '25h', toRead: 5 }} labelStyle={styles.subtitle} />
        </View>

        <View style={styles.section}>
          {loading ? (
            <ActivityIndicator size="small" color="#5A4FFF" />
          ) : (
            <BookCarousel
              title="Recomendados para ti"
              titleStyle={styles.title}
              bookTitleStyle={styles.subtitle}
              authorStyle={styles.subtitle}
              books={recommendations.map((book) => ({
                ...book,
                image: { uri: book.image },
              }))}
            />
          )}
        </View>

        <View style={styles.section}>
          <ReadingChallenge
            title="Reto: leer 20 libros en 2025"
            titleStyle={styles.title}
            current={favorites.length}
            total={20}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
