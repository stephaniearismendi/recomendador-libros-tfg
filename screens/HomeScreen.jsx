import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import GenreFilter from '../components/GenreFilter';
import Selector from '../components/Selector';
import BookCard from '../components/BookCard';
import styles from '../styles/exploreStyles';
import { getPopularBooks } from '../api/api';

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await getPopularBooks();
        setBooks(res.data);
      } catch (err) {
        console.error('Error al obtener libros populares:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Explora lecturas</Text>
        <Text style={styles.subheading}>Encuentra el próximo libro que te atrape</Text>

        <View style={styles.section}>
          <GenreFilter />
        </View>

        <View style={styles.section}>
          <Selector label="Estado de ánimo" />
          <Selector label="Ritmo de lectura" />
        </View>

        <Text style={styles.sectionTitle}>Recomendaciones populares</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#5A4FFF" style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.cardContainer}>
            {books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
