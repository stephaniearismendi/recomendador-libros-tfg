import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import GenreFilter from '../components/GenreFilter';
import Selector from '../components/Selector';
import BookCard from '../components/BookCard';
import styles from '../styles/exploreStyles';
import { getPopularBooks } from '../api/api';

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await getPopularBooks();
        const enriched = res.data.map((book) => ({
          ...book,
          genre: ['Romántica', 'Ficción', 'Misterio'][Math.floor(Math.random() * 3)],
          mood: ['Ligero', 'Reflexivo', 'Oscuro', 'Divertido'][Math.floor(Math.random() * 4)],
        }));
        setBooks(enriched);
        setFilteredBooks(enriched);
      } catch (err) {
        console.error('Error al obtener libros populares:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  useEffect(() => {
    let result = books;
    if (selectedGenre) {
      result = result.filter((b) => b.genre === selectedGenre);
    }
    if (selectedMood) {
      result = result.filter((b) => b.mood === selectedMood);
    }
    setFilteredBooks(result);
  }, [selectedGenre, selectedMood, books]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.heading}>📚 Explora lecturas</Text>
          <Text style={styles.subheading}>Encuentra el próximo libro que te atrape</Text>
        </View>

        <View style={styles.filterSection}>
          <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
          <View style={styles.selectorRow}>
            <Selector
              label="Estado de ánimo"
              options={['Ligero', 'Reflexivo', 'Oscuro', 'Divertido']}
              selected={selectedMood}
              onSelect={setSelectedMood}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Populares</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#5A4FFF" style={{ marginTop: 24 }} />
          ) : filteredBooks.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>
              No hay libros que coincidan con los filtros.
            </Text>
          ) : (
            <FlatList
              data={filteredBooks}
              keyExtractor={(item) => item.id?.toString() || item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => (
                <BookCard
                  id={item.id}
                  title={item.title}
                  author={item.author}
                  rating={item.rating}
                  image={item.image}
                  description={item.description}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
