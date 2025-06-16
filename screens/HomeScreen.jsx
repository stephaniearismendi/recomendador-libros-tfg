import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import GenreFilter from '../components/GenreFilter';
import Selector from '../components/Selector';
import BookCard from '../components/BookCard';
import styles from '../styles/exploreStyles';

const books = [
  {
    title: "Los juegos del hambre",
    author: "Suzanne Collins",
    rating: "4.5",
    image: require('../assets/books/los-juegos-del-hambre.jpg'),
  },
  {
    title: "La asistenta",
    author: "Freida McFadden",
    rating: "4.2",
    image: require('../assets/books/la-asistenta.jpg'),
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Explora lecturas</Text>
        <Text style={styles.subheading}>Encuentra el próximo libro que te atrape</Text>
        <View style={styles.section}>
          <GenreFilter />
        </View>
        <View style={styles.section}>
          <Selector label="Estado de ánimo" />
          <Selector label="Ritmo de lectura" />
        </View>
        <Text style={styles.sectionTitle}>Recomendaciones populares</Text>
        <View style={styles.cardContainer}>
          {books.map((book, idx) => (
            <BookCard key={idx} {...book} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}