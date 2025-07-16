import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import CurrentlyReadingCard from '../components/CurrentlyReadingCard';
import StatsRow from '../components/StatsRow';
import BookCarousel from '../components/BookCarousel.js';
import ReadingChallenge from '../components/ReadingChallenge';
import styles from '../styles/libraryStyles';

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header greeting="¡Hola, Alex!" greetingStyle={styles.greeting} />
        <View style={styles.currentlySection}>
          <CurrentlyReadingCard
            book={{
              title: 'Project Hail Mary',
              author: 'Andy Weir',
              chapter: 'Capítulo 7 de 24',
              progress: 29,
              timeLeft: '12min restantes',
              image: require('../../assets/books/project-hail-mary.jpg'),
            }}
            titleStyle={styles.title}
            authorStyle={styles.subtitle}
          />
        </View>
        <View style={styles.section}>
          <StatsRow stats={{ read: 12, time: '48h', toRead: 4 }} labelStyle={styles.subtitle} />
        </View>
        <View style={styles.section}>
          <BookCarousel
            title="Recomendados para ti"
            titleStyle={styles.title}
            bookTitleStyle={styles.subtitle}
            authorStyle={styles.subtitle}
            books={[
              {
                title: 'Dune',
                author: 'Frank Herbert',
                image: require('../../assets/books/dune.jpg'),
              },
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
            ]}
          />
        </View>
        <View style={styles.section}>
          <ReadingChallenge
            title="Reto: leer 20 libros en 2025"
            titleStyle={styles.title}
            current={12}
            total={20}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
