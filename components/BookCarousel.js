import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

export default function BookCarousel({ title, books }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.book}>
            <Image source={item.image} style={styles.cover} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  seeAll: {
    color: '#6366F1',
    fontSize: 12,
  },
  book: {
    marginRight: 12,
    width: 100,
  },
  cover: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  author: {
    fontSize: 11,
    color: '#6B7280',
  },
});
