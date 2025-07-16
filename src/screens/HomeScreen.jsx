import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import GenreFilter from '../components/GenreFilter';
import Selector from '../components/Selector';
import BookCard from '../components/BookCard';
import styles from '../styles/exploreStyles';
import { getPopularBooks, getAdaptedBooks, getNewYorkTimesBooks } from '../api/api';

const MOODS = ['Ligero', 'Reflexivo', 'Oscuro', 'Divertido'];
const GENRES = ['Romántica', 'Ficción', 'Misterio'];

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [adaptedBooks, setAdaptedBooks] = useState([]);
  const [nytBooks, setNytBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [popularRes, adaptedRes, nytRes] = await Promise.all([
          getPopularBooks(),
          getAdaptedBooks(),
          getNewYorkTimesBooks(),
        ]);

        const enrich = (book) => ({
          ...book,
          genre: GENRES[Math.floor(Math.random() * GENRES.length)],
          mood: MOODS[Math.floor(Math.random() * MOODS.length)],
        });

        setBooks(popularRes.data.map(enrich));
        setAdaptedBooks(adaptedRes.data.map(enrich));
        setNytBooks(nytRes.data.map(enrich));
      } catch (err) {
        console.error('Error al obtener libros:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const applyFilters = (list) =>
    list.filter(
      (book) =>
        (!selectedGenre || book.genre === selectedGenre) &&
        (!selectedMood || book.mood === selectedMood),
    );

  const filteredPopular = useMemo(() => applyFilters(books), [books, selectedGenre, selectedMood]);
  const filteredAdapted = useMemo(
    () => applyFilters(adaptedBooks),
    [adaptedBooks, selectedGenre, selectedMood],
  );
  const filteredNytBooks = useMemo(
    () => applyFilters(nytBooks),
    [nytBooks, selectedGenre, selectedMood],
  );

  const renderBookSection = (title, data, emptyMessage) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#5A4FFF" style={{ marginTop: 24 }} />
      ) : data.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={data}
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
  );

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
              options={MOODS}
              selected={selectedMood}
              onSelect={setSelectedMood}
            />
          </View>
        </View>

        {renderBookSection(
          '🔥 Populares',
          filteredPopular,
          'No hay libros que coincidan con los filtros.',
        )}
        {renderBookSection(
          '🎬 Adaptados al cine',
          filteredAdapted,
          'No se encontraron libros adaptados.',
        )}
        {renderBookSection(
          '📈 Más vendidos (NYT)',
          filteredNytBooks,
          'No se encontraron libros del New York Times.',
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
