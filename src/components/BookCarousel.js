import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookCarousel({
  title = '',
  books = [],
  titleStyle,
  bookTitleStyle,
  authorStyle,
  onPressBook,
  onSeeAll,
  showSeeAll = true,
}) {
  const renderItem = ({ item }) => {
    // Debug logging para libros sin descripción/portada
    if (!item?.description || !item?.image) {
      console.log('🔍 BookCarousel Debug - Libro sin datos completos:', {
        title: item?.title,
        author: item?.author,
        hasDescription: !!item?.description,
        hasImage: !!item?.image,
        imageType: typeof item?.image,
        imageValue: item?.image,
        allKeys: Object.keys(item || {})
      });
    }
    
    const src = item?.image?.uri
      ? { uri: item.image.uri }
      : typeof item?.image === 'string'
        ? { uri: item.image }
        : item?.image || { uri: 'https://covers.openlibrary.org/b/id/240727-M.jpg' };

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPressBook?.(item)}>
        <View style={styles.imageContainer}>
          <Image source={src} style={styles.bookImage} />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.bookTitle, bookTitleStyle]} numberOfLines={2}>
            {item?.title || 'Sin título'}
          </Text>
          <Text style={[styles.bookAuthor, authorStyle]} numberOfLines={1}>
            {item?.author || item?.authors?.[0]?.name || 'Autor desconocido'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
        {showSeeAll && onSeeAll && (
          <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>Ver todo</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#6366F1" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={books}
        keyExtractor={(item, idx) =>
          String(
            item?.id ||
              item?.key ||
              item?.olid ||
              item?.workId ||
              item?.isbn?.[0] ||
              item?.title ||
              idx,
          )
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#3b5998' },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  seeAllText: { color: '#6366F1', fontSize: 13, fontFamily: 'Poppins-Medium', marginRight: 2 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    marginRight: 16,
    width: 130,
    height: 240, // Altura fija para consistencia
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAE7E1',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bookImage: {
    width: 100,
    height: 145,
    borderRadius: 12,
    backgroundColor: '#F7F6F3',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1F2328',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
    minHeight: 36, // Altura mínima para 2 líneas
  },
  bookAuthor: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
    minHeight: 16, // Altura mínima para 1 línea
  },
});
