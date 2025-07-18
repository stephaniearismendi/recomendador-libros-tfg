import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native-expo-image-cache';

export default function BookCard({ id, title, author, rating, image, description }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('BookDetail', {
          book: { id, title, author, rating, image, description },
        })
      }
    >
      <Image
        uri={image}
        style={styles.bookImage}
        resizeMode="cover"
        preview={{ uri: image }}
        tint="light"
      />
      <Text style={styles.bookTitle}>{title}</Text>
      <Text style={styles.bookAuthor}>{author}</Text>
      {rating && (
        <View style={styles.rating}>
          {Number(rating) ? (
            <>
              <MaterialIcons name="star" size={14} color="#FFD700" style={styles.star} />
              <Text style={styles.ratingText}>{rating}</Text>
            </>
          ) : (
            <Text style={[styles.ratingText, { color: '#E63946' }]}>{rating}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    width: 124,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bookImage: {
    width: 100,
    height: 145,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },
  bookTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'center',
  },
  star: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6366F1',
  },
});
