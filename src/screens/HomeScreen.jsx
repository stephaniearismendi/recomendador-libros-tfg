import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import AdvancedFilters from '../components/AdvancedFilters';
import BookCard from '../components/BookCard';
import styles from '../styles/exploreStyles';
import { baseStyles, COLORS, TYPOGRAPHY } from '../styles/baseStyles';
import { getPopularBooks, getAdaptedBooks, getNewYorkTimesBooks } from '../api/api';
import { categorizeBook } from '../utils/bookCategorizer';

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [adaptedBooks, setAdaptedBooks] = useState([]);
  const [nytBooks, setNytBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [hasBackendError, setHasBackendError] = useState(false);
  const [endpointStatus, setEndpointStatus] = useState({
    popular: true,
    adapted: true,
    nyt: true
  });

  const enrich = useCallback((book) => {
    let finalGenre = book.genre || book.category || book.subject;
    let finalMood = book.mood || book.tone;
    
    if (!finalGenre) {
      const categorization = categorizeBook(book);
      finalGenre = categorization.genre;
      finalMood = categorization.mood;
    }
    
    return {
      ...book,
      genre: finalGenre,
      mood: finalMood,
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [popularRes, adaptedRes, nytRes] = await Promise.allSettled([
        getPopularBooks().catch(err => {
          setEndpointStatus(prev => ({ ...prev, popular: false }));
          return { data: [] };
        }),
        getAdaptedBooks().catch(err => {
          setEndpointStatus(prev => ({ ...prev, adapted: false }));
          return { data: [] };
        }),
        getNewYorkTimesBooks().catch(err => {
          setEndpointStatus(prev => ({ ...prev, nyt: false }));
          return { data: [] };
        }),
      ]);

      const popularBooks = popularRes.status === 'fulfilled' ? popularRes.value.data || [] : [];
      const adaptedBooks = adaptedRes.status === 'fulfilled' ? adaptedRes.value.data || [] : [];
      const nytBooks = nytRes.status === 'fulfilled' ? nytRes.value.data || [] : [];

      setBooks(popularBooks.map(enrich));
      setAdaptedBooks(adaptedBooks.map(enrich));
      setNytBooks(nytBooks.map(enrich));

      const hasAnyErrors = popularRes.status === 'rejected' || adaptedRes.status === 'rejected' || nytRes.status === 'rejected';
      const hasAnyBooks = popularBooks.length > 0 || adaptedBooks.length > 0 || nytBooks.length > 0;
      
      if (hasAnyErrors && !hasAnyBooks) {
        setBooks([]);
        setHasBackendError(true);
      } else {
        setHasBackendError(false);
      }

    } catch (err) {
      setBooks([]);
      setHasBackendError(true);
    } finally {
      setLoading(false);
    }
  }, [enrich]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getGenreId = (genre) => {
    if (!genre) return 'fiction';
    
    const genreStr = genre.toString().toLowerCase();
    const genreMap = {
      'romance': 'romance', 'romántica': 'romance', 'romántico': 'romance', 'love': 'romance', 'amor': 'romance',
      'mystery': 'mystery', 'misterio': 'mystery', 'detective': 'mystery', 'crime': 'mystery', 'crimen': 'mystery',
      'sci-fi': 'sci-fi', 'science fiction': 'sci-fi', 'ciencia ficción': 'sci-fi', 'science': 'sci-fi', 'futuro': 'sci-fi', 'space': 'sci-fi', 'espacio': 'sci-fi',
      'fantasy': 'fantasy', 'fantasía': 'fantasy', 'magic': 'fantasy', 'magia': 'fantasy', 'dragon': 'fantasy', 'dragón': 'fantasy',
      'thriller': 'thriller', 'suspense': 'thriller', 'suspenso': 'thriller', 'horror': 'thriller', 'terror': 'thriller',
      'fiction': 'fiction', 'ficción': 'fiction', 'novel': 'fiction', 'novela': 'fiction', 'literature': 'fiction', 'literatura': 'fiction'
    };
    
    if (genreMap[genreStr]) return genreMap[genreStr];
    
    for (const [key, value] of Object.entries(genreMap)) {
      if (genreStr.includes(key) || key.includes(genreStr)) return value;
    }
    
    return 'fiction';
  };

  const getMoodId = (mood) => {
    if (!mood) return 'reflective';
    
    const moodStr = mood.toString().toLowerCase();
    const moodMap = {
      'light': 'light', 'ligero': 'light', 'happy': 'light', 'feliz': 'light', 'cheerful': 'light', 'alegre': 'light',
      'reflective': 'reflective', 'reflexivo': 'reflective', 'thoughtful': 'reflective', 'pensativo': 'reflective', 'deep': 'reflective', 'profundo': 'reflective',
      'dark': 'dark', 'oscuro': 'dark', 'sad': 'dark', 'triste': 'dark', 'melancholy': 'dark', 'melancolía': 'dark',
      'fun': 'fun', 'divertido': 'fun', 'funny': 'fun', 'gracioso': 'fun', 'entertaining': 'fun', 'entretenido': 'fun'
    };
    
    if (moodMap[moodStr]) return moodMap[moodStr];
    
    for (const [key, value] of Object.entries(moodMap)) {
      if (moodStr.includes(key) || key.includes(moodStr)) return value;
    }
    
    return 'reflective';
  };

  const getRatingFilter = (ratingId) => {
    const ratingMap = { 'high': { min: 4 }, 'medium': { min: 3 }, 'any': { min: 0 } };
    return ratingMap[ratingId] || { min: 0 };
  };

  const getGenreKeywords = (genreId) => {
    const keywordMap = {
      'romance': ['amor', 'romance', 'romántico', 'romántica', 'pareja', 'relación', 'corazón'],
      'mystery': ['misterio', 'misterioso', 'detective', 'crimen', 'asesinato', 'investigación', 'secreto'],
      'sci-fi': ['ciencia ficción', 'futuro', 'espacio', 'robot', 'alien', 'tecnología', 'galaxia'],
      'fantasy': ['fantasía', 'mágico', 'dragón', 'hechizo', 'reino', 'príncipe', 'princesa'],
      'thriller': ['thriller', 'suspense', 'tensión', 'peligro', 'amenaza', 'intriga'],
      'fiction': ['ficción', 'novela', 'historia', 'aventura', 'drama']
    };
    return keywordMap[genreId] || [];
  };

  const getMoodKeywords = (moodId) => {
    const keywordMap = {
      'light': ['ligero', 'divertido', 'alegre', 'optimista', 'feliz', 'cómico'],
      'reflective': ['reflexivo', 'profundo', 'filosófico', 'pensativo', 'serio', 'contemplativo'],
      'dark': ['oscuro', 'triste', 'melancólico', 'sombrío', 'depresivo', 'tenebroso'],
      'fun': ['divertido', 'cómico', 'gracioso', 'entretenido', 'alegre', 'risa']
    };
    return keywordMap[moodId] || [];
  };

  const applyFilters = (list) => {
    if (Object.keys(selectedFilters).length === 0) return list;
    
    return list.filter((book) => {
      let matchesFilters = true;
      
      if (selectedFilters.genres?.length > 0) {
        const bookGenreId = getGenreId(book.genre);
        const hasGenreMatch = selectedFilters.genres.includes(bookGenreId);
        
        if (!hasGenreMatch) {
          const hasPartialMatch = selectedFilters.genres.some(genreId => {
            const genreKeywords = getGenreKeywords(genreId);
            const bookText = `${book.title || ''} ${book.description || ''}`.toLowerCase();
            return genreKeywords.some(keyword => bookText.includes(keyword));
          });
          if (!hasPartialMatch) matchesFilters = false;
        }
      }
      
      if (selectedFilters.moods?.length > 0 && matchesFilters) {
        const bookMoodId = getMoodId(book.mood);
        const hasMoodMatch = selectedFilters.moods.includes(bookMoodId);
        
        if (!hasMoodMatch) {
          const hasPartialMatch = selectedFilters.moods.some(moodId => {
            const moodKeywords = getMoodKeywords(moodId);
            const bookText = `${book.title || ''} ${book.description || ''}`.toLowerCase();
            return moodKeywords.some(keyword => bookText.includes(keyword));
          });
          if (!hasPartialMatch) matchesFilters = false;
        }
      }
      
      if (selectedFilters.ratings?.length > 0 && matchesFilters) {
        const bookRating = parseFloat(book.rating) || 0;
        const hasValidRating = selectedFilters.ratings.some(ratingId => {
          const ratingFilter = getRatingFilter(ratingId);
          return bookRating >= ratingFilter.min;
        });
        
        if (!hasValidRating && bookRating === 0) {
          const hasAnyRating = selectedFilters.ratings.includes('any');
          if (!hasAnyRating) matchesFilters = false;
        } else if (!hasValidRating) {
          matchesFilters = false;
        }
      }
      
      return matchesFilters;
    });
  };

  const filteredPopular = useMemo(() => applyFilters(books), [books, selectedFilters]);
  const filteredAdapted = useMemo(() => applyFilters(adaptedBooks), [adaptedBooks, selectedFilters]);
  const filteredNytBooks = useMemo(() => applyFilters(nytBooks), [nytBooks, selectedFilters]);

  const allBooks = useMemo(() => [...books, ...adaptedBooks, ...nytBooks], [books, adaptedBooks, nytBooks]);
  const allFilteredBooks = useMemo(() => [...filteredPopular, ...filteredAdapted, ...filteredNytBooks], [filteredPopular, filteredAdapted, filteredNytBooks]);

  const renderBookSection = (title, data, emptyMessage, subtitle, isEndpointAvailable = true) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, !isEndpointAvailable && styles.sectionTitleUnavailable]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
          {!isEndpointAvailable && (
            <Text style={styles.endpointUnavailableText}>
              ⚠️ Servicio temporalmente no disponible
            </Text>
          )}
        </View>
        <View style={[styles.sectionBadge, !isEndpointAvailable && styles.sectionBadgeUnavailable]}>
          <Text style={styles.sectionBadgeText}>{data.length}</Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A4FFF" />
          <Text style={styles.loadingText}>Cargando libros...</Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>📖</Text>
          </View>
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
            title="Actualizando..."
            titleColor={COLORS.ACCENT}
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
              <Text style={styles.statNumber}>{new Set(allBooks.map(b => b.genre)).size}</Text>
              <Text style={styles.statLabel}>Géneros</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{allFilteredBooks.length}</Text>
              <Text style={styles.statLabel}>Filtrados</Text>
            </View>
          </View>
        </View>

        {hasBackendError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>
              ⚠️ Los servidores están temporalmente fuera de servicio. Mostrando libros de muestra.
            </Text>
          </View>
        )}

        <AdvancedFilters
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          totalBooks={allBooks.length}
          filteredCount={allFilteredBooks.length}
        />

        {renderBookSection(
          'Libros populares',
          filteredPopular,
          'No hay libros que coincidan con los filtros seleccionados.',
          'Los más leídos en la comunidad',
          endpointStatus.popular
        )}
        {renderBookSection(
          'Adaptaciones cinematográficas',
          filteredAdapted,
          'No se encontraron libros adaptados al cine.',
          'Libros que saltaron a la pantalla grande',
          endpointStatus.adapted
        )}
        {renderBookSection(
          'Más vendidos',
          filteredNytBooks,
          'No se encontraron libros de la lista de más vendidos.',
          'Según The New York Times',
          endpointStatus.nyt
        )}
      </ScrollView>
    </SafeAreaView>
  );
}