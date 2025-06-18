import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookCarousel({ title, books, titleStyle, bookTitleStyle, authorStyle }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>Ver todo</Text>
          <MaterialIcons name="arrow-forward-ios" size={14} color="#6366F1" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <Image source={item.image} style={styles.cover} />
            <Text style={[styles.title, bookTitleStyle]} numberOfLines={2}>{item.title}</Text>
            <Text style={[styles.author, authorStyle]} numberOfLines={1}>{item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#3b5998',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  seeAllText: {
    color: '#6366F1',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginRight: 2,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    width: 124, // Más ancho para evitar cortes
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cover: {
    width: 100,
    height: 145,
    borderRadius: 8,
    marginBottom: 12, 
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 15, 
    fontFamily: 'Poppins-Bold',
    color: '#222', 
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 12, 
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});