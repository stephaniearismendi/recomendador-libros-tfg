import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../components/Header';
import CurrentlyReadingCard from '../components/CurrentlyReadingCard';
import StatsRow from '../components/StatsRow';
import BookCarousel from '../components/BookCarousel.js';
import ReadingChallenge from '../components/ReadingChallenge';
import styles from '../styles/libraryStyles';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header greeting="Hi, Alex" />
        <CurrentlyReadingCard
          book={{
            title: 'Project Hail Mary',
            author: 'Andy Weir',
            chapter: 'Chapter 7 of 24',
            progress: 29,
            timeLeft: '12min left',
            image: require('../assets/books/project-hail-mary.jpg'),
          }}
        />
        <StatsRow stats={{ read: 12, time: '48h', toRead: 4 }} />
        <BookCarousel title="Recommended for You" books={[
          { title: 'Dune', author: 'Frank Herbert', image: require('../assets/books/dune.jpg') },
          { title: 'Foundation', author: 'Isaac Asimov', image: require('../assets/books/foundation.jpg') },
          { title: 'Neuromancer', author: 'William Gibson', image: require('../assets/books/neuromancer.jpg') },
        ]} />
        <ReadingChallenge title="Read 20 Books in 2025" current={12} total={20} />
      </ScrollView>
    </View>
  );
}
