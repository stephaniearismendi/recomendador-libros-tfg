import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookCard({ title, author, rating, image, description }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('BookDetail', {
          book: { title, author, rating, image, description },
        })
      }
    >
      <Image source={image} style={styles.bookImage} />
      <Text style={styles.bookTitle}>{title}</Text>
      <Text style={styles.bookAuthor}>{author}</Text>
      <View style={styles.rating}>
        <MaterialIcons name="star" size={14} color="#FFD700" style={styles.star} />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  bookImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookAuthor: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  star: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6366F1',
  },
});