import React from 'react';
import { SafeAreaView, View, Text, FlatList, Image, StyleSheet } from 'react-native';

const favoriteBooks = [
  { title: 'Dune', author: 'Frank Herbert', image: require('../../assets/books/dune.jpg') },
  {
    title: 'Foundation',
    author: 'Isaac Asimov',
    image: require('../../assets/books/foundation.jpg'),
  },
  {
    title: 'Neuromancer',
    author: 'William Gibson',
    image: require('../../assets/books/neuromancer.jpg'),
  },
];

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.background}>
      <Text style={styles.title}>Mis Favoritos</Text>
      <FlatList
        data={favoriteBooks}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FAF8F5', // Paleta consistente
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#3b5998',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  info: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    color: '#222',
  },
  author: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#888',
  },
});
