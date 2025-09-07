import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import AdvancedFilters from '../components/AdvancedFilters';
import BookCard from '../components/BookCard';
import styles from '../styles/exploreStyles';
import { baseStyles, COLORS } from '../styles/baseStyles';
import { getPopularBooks, getAdaptedBooks, getNewYorkTimesBooks } from '../api/api';

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [adaptedBooks, setAdaptedBooks] = useState([]);
  const [nytBooks, setNytBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const loadData = useCallback(async () => {
    try {
      const [popularRes, adaptedRes, nytRes] = await Promise.allSettled([
        getPopularBooks(),
        getAdaptedBooks(),
        getNewYorkTimesBooks(),
      ]);

      const popularBooks = popularRes.status === 'fulfilled' ? popularRes.value.data || [] : [];
      const adaptedBooks = adaptedRes.status === 'fulfilled' ? adaptedRes.value.data || [] : [];
      const nytBooks = nytRes.status === 'fulfilled' ? nytRes.value.data || [] : [];

      setBooks(popularBooks);
      setAdaptedBooks(adaptedBooks);
      setNytBooks(nytBooks);
    } catch (err) {
      setBooks([]);
      setAdaptedBooks([]);
      setNytBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (err) {
      // Error silencioso
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const applyFilters = useCallback((list) => {
    try {
      if (!selectedFilters || Object.keys(selectedFilters).length === 0) return list;
      
      return list.filter((book) => {
        if (selectedFilters.genres?.length > 0) {
          const bookText = `${book.title || ''} ${book.description || ''} ${book.author || ''} ${book.genre || ''} ${book.category || ''} ${book.subject || ''}`.toLowerCase();
          
          return selectedFilters.genres.some(genreId => {
            const genreKeywords = {
              'romance': ['amor', 'romance', 'romántico', 'romántica', 'pareja', 'relación', 'corazón', 'pasión', 'sentimental', 'enamorado', 'enamorada', 'novia', 'novio', 'matrimonio', 'boda', 'beso', 'besos', 'abrazo', 'cariño', 'querer', 'querida', 'querido', 'amante', 'amantes', 'historia de amor', 'novela romántica', 'romance histórico', 'contemporáneo', 'joven adulto', 'ya', 'young adult', 'love', 'romantic', 'couple', 'relationship', 'heart', 'passion', 'wedding', 'kiss', 'hug', 'darling', 'sweetheart'],
              'mystery': ['misterio', 'misterioso', 'detective', 'crimen', 'asesinato', 'investigación', 'secreto', 'enigma', 'policial', 'policía', 'comisario', 'inspector', 'caso', 'víctima', 'sospechoso', 'pista', 'evidencia', 'muerto', 'muerte', 'asesino', 'asesina', 'thriller', 'suspense', 'mystery', 'crime', 'murder', 'detective', 'police', 'investigation', 'secret', 'clue', 'evidence', 'victim', 'suspect'],
              'sci-fi': ['ciencia ficción', 'futuro', 'espacio', 'robot', 'alien', 'tecnología', 'galaxia', 'nave espacial', 'futurista', 'ciencia', 'científico', 'laboratorio', 'experimento', 'dna', 'genética', 'inteligencia artificial', 'ia', 'cyber', 'virtual', 'realidad virtual', 'viaje en el tiempo', 'dimensión', 'universo paralelo', 'science fiction', 'future', 'space', 'robot', 'alien', 'technology', 'galaxy', 'spaceship', 'laboratory', 'experiment', 'genetics', 'artificial intelligence', 'ai', 'cyber', 'virtual reality', 'time travel', 'dimension', 'parallel universe'],
              'fantasy': ['fantasía', 'mágico', 'dragón', 'hechizo', 'reino', 'príncipe', 'princesa', 'héroe', 'épico', 'magia', 'bruja', 'brujo', 'hechicero', 'hechicera', 'varita', 'encantamiento', 'cristal', 'gema', 'piedra', 'anillo', 'espada', 'guerrero', 'caballero', 'castillo', 'torre', 'bosque encantado', 'criatura mágica', 'fantasy', 'magic', 'dragon', 'spell', 'kingdom', 'prince', 'princess', 'hero', 'epic', 'witch', 'wizard', 'wand', 'enchantment', 'crystal', 'gem', 'stone', 'ring', 'sword', 'warrior', 'knight', 'castle', 'tower', 'enchanted forest', 'magical creature'],
              'thriller': ['thriller', 'suspense', 'tensión', 'peligro', 'amenaza', 'intriga', 'psicológico', 'terror', 'horror', 'miedo', 'escalofriante', 'inquietante', 'siniestro', 'macabro', 'sangre', 'violencia', 'asesino en serie', 'psicópata', 'maníaco', 'obsesión', 'venganza', 'secuestro', 'persecución', 'tension', 'danger', 'threat', 'intrigue', 'psychological', 'terror', 'horror', 'fear', 'chilling', 'disturbing', 'sinister', 'macabre', 'blood', 'violence', 'serial killer', 'psychopath', 'maniac', 'obsession', 'revenge', 'kidnapping', 'pursuit'],
              'fiction': ['ficción', 'novela', 'historia', 'aventura', 'drama', 'contemporáneo', 'clásico', 'moderno', 'literatura', 'narrativa', 'prosa', 'escritor', 'autor', 'libro', 'lectura', 'historia', 'relato', 'cuento', 'biografía', 'memorias', 'autobiografía', 'fiction', 'novel', 'story', 'adventure', 'drama', 'contemporary', 'classic', 'modern', 'literature', 'narrative', 'prose', 'writer', 'author', 'book', 'reading', 'tale', 'biography', 'memoirs', 'autobiography']
            };
            const keywords = genreKeywords[genreId] || [];
            return keywords.some(keyword => bookText.includes(keyword));
          });
        }
        return true;
      });
    } catch (err) {
      return list;
    }
  }, [selectedFilters]);

  const filteredPopular = useMemo(() => applyFilters(books), [books, applyFilters]);
  const filteredAdapted = useMemo(() => applyFilters(adaptedBooks), [adaptedBooks, applyFilters]);
  const filteredNytBooks = useMemo(() => applyFilters(nytBooks), [nytBooks, applyFilters]);

  const allBooks = useMemo(() => [...books, ...adaptedBooks, ...nytBooks], [books, adaptedBooks, nytBooks]);
  const allFilteredBooks = useMemo(() => [...filteredPopular, ...filteredAdapted, ...filteredNytBooks], [filteredPopular, filteredAdapted, filteredNytBooks]);

  const renderBookSection = (title, data, emptyMessage) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>{data.length}</Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A4FFF" />
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString() || item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.booksList}
          renderItem={({ item, index }) => (
            <View style={[styles.bookCardContainer, index === 0 && styles.firstBookCard]}>
              <BookCard
                id={item.id}
                title={item.title}
                author={item.author}
                rating={item.rating}
                image={item.image}
                description={item.description}
              />
            </View>
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={baseStyles.container}>
      <ScrollView 
        contentContainerStyle={baseStyles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.ACCENT]}
            tintColor={COLORS.ACCENT}
          />
        }
      >
        <View style={baseStyles.card}>
          <View style={styles.headerContent}>
            <Text style={styles.heading}>Explora lecturas</Text>
            <Text style={styles.subheading}>Descubre tu próxima lectura favorita</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{allBooks.length}</Text>
              <Text style={styles.statLabel}>Libros</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{allFilteredBooks.length}</Text>
              <Text style={styles.statLabel}>Filtrados</Text>
            </View>
          </View>
        </View>

        <AdvancedFilters
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          totalBooks={allBooks.length}
          filteredCount={allFilteredBooks.length}
        />

        {renderBookSection(
          'Libros populares',
          filteredPopular,
          'No hay libros que coincidan con los filtros seleccionados.'
        )}
        {renderBookSection(
          'Adaptaciones cinematográficas',
          filteredAdapted,
          'No se encontraron libros adaptados al cine.'
        )}
        {renderBookSection(
          'Más vendidos',
          filteredNytBooks,
          'No se encontraron libros de la lista de más vendidos.'
        )}
      </ScrollView>
    </SafeAreaView>
  );
}