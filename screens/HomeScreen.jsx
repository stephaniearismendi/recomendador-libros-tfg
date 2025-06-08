import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import GenreFilter from '../components/GenreFilter';
import Selector from '../components/Selector';
import BookCard from '../components/BookCard';
import styles from '../styles/exploreStyles';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabecera */}
        <Text style={styles.heading}>Explora lecturas</Text>
        <Text style={styles.subheading}>Encuentra el próximo libro que te atrape</Text>

        {/* Filtros de género */}
        <GenreFilter />

        {/* Filtros adicionales */}
        <Selector label="Estado de ánimo" />
        <Selector label="Ritmo de lectura" />

        {/* Tarjetas de libros */}
        <View style={styles.cardContainer}>
          <BookCard
            title="Los juegos del hambre"
            author="Suzanne Collins"
            rating="4.5"
            image={require('../assets/books/los-juegos-del-hambre.jpg')}
          />
          <BookCard
            title="La asistenta"
            author="Freida McFadden"
            rating="4.2"
            image={require('../assets/books/la-asistenta.jpg')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
