import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const genres = ['Todos', 'Ficción', 'Misterio', 'Romántica'];

export default function GenreFilter({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {genres.map((genre) => {
        const isSelected = selected === genre || (genre === 'Todos' && !selected);
        return (
          <TouchableOpacity
            key={genre}
            style={isSelected ? styles.primary : styles.secondary}
            onPress={() => onSelect(genre === 'Todos' ? null : genre)}
          >
            <Text style={isSelected ? styles.primaryText : styles.secondaryText}>{genre}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  primary: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  secondary: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  secondaryText: {
    color: '#1F2937',
    fontSize: 13,
  },
});
