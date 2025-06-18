import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function BookSection({ title, books }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.bookRow}>
        <Image source={require('../assets/books/los-juegos-del-hambre.jpg')} style={sectionStyles.cover} />
        <View>
          <Text style={sectionStyles.bookTitle}>Título</Text>
          <Text style={sectionStyles.bookAuthor}>Autor</Text>
        </View>
      </View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  bookAuthor: {
    fontSize: 12,
    color: '#6B7280',
  },
});
