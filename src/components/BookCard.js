import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native-expo-image-cache';

export default function BookCard({ id, title, author, rating, image, description }) {
  const navigation = useNavigation();
  
  // Debug logging for NYT books
  if (title && title.includes('NYT') || id?.includes('nyt')) {
    console.log('🔍 BookCard NYT Debug:', {
      id,
      title,
      author,
      image,
      description: description?.substring(0, 50) + '...',
      hasImage: !!image,
      hasDescription: !!description
    });
  }
  
  // Elegant fallback for missing covers
  const bookCover = image || 'https://covers.openlibrary.org/b/id/240727-M.jpg';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('BookDetail', {
          book: { id, title, author, rating, image, description },
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          uri={bookCover}
          style={styles.bookImage}
          resizeMode="cover"
          preview={{ uri: bookCover }}
          tint="light"
          onError={(error) => console.log('❌ BookCard image load error:', error.nativeEvent.error)}
          onLoad={() => console.log('✅ BookCard image loaded successfully')}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.bookTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{author}</Text>
        
        {rating && (
          <View style={styles.rating}>
            {Number(rating) ? (
              <>
                <MaterialIcons name="star" size={12} color="#FFD700" style={styles.star} />
                <Text style={styles.ratingText}>{rating}</Text>
              </>
            ) : (
              <Text style={[styles.ratingText, { color: '#E63946' }]}>{rating}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

import { COLORS } from '../styles/baseStyles';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    width: 130,
    height: 240, // Altura fija para consistencia
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bookImage: {
    width: 100,
    height: 145,
    borderRadius: 12,
    backgroundColor: COLORS.BG,
    shadowColor: COLORS.SHADOW,
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
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
    minHeight: 36, // Altura mínima para 2 líneas
  },
  bookAuthor: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: COLORS.SUBT,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
    minHeight: 16, // Altura mínima para 1 línea
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F1FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  star: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.ACCENT,
    fontFamily: 'Poppins-SemiBold',
  },
});
