import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import AdvancedFilters from '../components/AdvancedFilters';
import BookCard from '../components/BookCard';
import { baseStyles, COLORS } from '../styles/baseStyles';
import { homeStyles } from '../styles/components';
import { useCustomSafeArea } from '../utils/safeAreaUtils';
import { 
  loadHomeData, 
  applyGenreFilters, 
  combineBookLists, 
  getBookSections 
} from '../utils/homeUtils';

export default function HomeScreen() {
  const { getContainerStyle, getScrollStyle } = useCustomSafeArea();
  const [books, setBooks] = useState([]);
  const [adaptedBooks, setAdaptedBooks] = useState([]);
  const [nytBooks, setNytBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const loadData = useCallback(async () => {
    try {
      const { popularBooks, adaptedBooks, nytBooks } = await loadHomeData();
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
      // Handle refresh error
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);



  const filteredPopular = useMemo(() => applyGenreFilters(books, selectedFilters), [books, selectedFilters]);
  const filteredAdapted = useMemo(() => applyGenreFilters(adaptedBooks, selectedFilters), [adaptedBooks, selectedFilters]);
  const filteredNytBooks = useMemo(() => applyGenreFilters(nytBooks, selectedFilters), [nytBooks, selectedFilters]);

  const allBooks = useMemo(() => combineBookLists(books, adaptedBooks, nytBooks), [books, adaptedBooks, nytBooks]);
  const allFilteredBooks = useMemo(() => combineBookLists(filteredPopular, filteredAdapted, filteredNytBooks), [filteredPopular, filteredAdapted, filteredNytBooks]);

  const renderBookSection = (title, data, emptyMessage) => (
    <View style={homeStyles.section}>
      <View style={homeStyles.sectionHeader}>
        <Text style={homeStyles.sectionTitle}>{title}</Text>
        <View style={homeStyles.sectionBadge}>
          <Text style={homeStyles.sectionBadgeText}>{data.length}</Text>
        </View>
      </View>
      {loading ? (
        <View style={homeStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.ACCENT} />
        </View>
      ) : data.length === 0 ? (
        <View style={homeStyles.emptyContainer}>
          <Text style={homeStyles.emptyMessage}>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString() || item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={homeStyles.booksList}
          renderItem={({ item, index }) => (
            <View style={[homeStyles.bookCardContainer, index === 0 && homeStyles.firstBookCard]}>
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

  const containerStyle = [baseStyles.container, getContainerStyle()];
  const scrollStyle = [baseStyles.scroll, getScrollStyle()];

  return (
    <View style={containerStyle}>
      <ScrollView 
        contentContainerStyle={scrollStyle}
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
          <View style={homeStyles.headerContent}>
            <Text style={homeStyles.heading}>Explora lecturas</Text>
            <Text style={homeStyles.subheading}>Descubre tu próxima lectura favorita</Text>
          </View>
          <View style={homeStyles.headerStats}>
            <View style={homeStyles.statItem}>
              <Text style={homeStyles.statNumber}>{allBooks.length}</Text>
              <Text style={homeStyles.statLabel}>Libros</Text>
            </View>
            <View style={homeStyles.statItem}>
              <Text style={homeStyles.statNumber}>{allFilteredBooks.length}</Text>
              <Text style={homeStyles.statLabel}>Filtrados</Text>
            </View>
          </View>
        </View>

        <AdvancedFilters
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          totalBooks={allBooks.length}
          filteredCount={allFilteredBooks.length}
        />

        {getBookSections(filteredPopular, filteredAdapted, filteredNytBooks).map((section, index) =>
          <View key={section.title || index}>
            {renderBookSection(section.title, section.data, section.emptyMessage)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}