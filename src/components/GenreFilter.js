import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { genreFilterStyles } from '../styles/components/GenreFilterStyles';
import { getAvailableGenres, isGenreSelected, handleGenreSelect } from '../utils/genreUtils';

export default function GenreFilter({ selected, onSelect }) {
  const genres = getAvailableGenres();

  const renderGenreChip = useCallback((genre) => {
    const isSelected = isGenreSelected(selected, genre);
    
    return (
      <TouchableOpacity
        key={genre}
        style={[
          genreFilterStyles.chip,
          isSelected ? genreFilterStyles.chipPrimary : genreFilterStyles.chipSecondary
        ]}
        onPress={() => handleGenreSelect(genre, onSelect)}
        activeOpacity={0.7}
      >
        <Text style={[
          genreFilterStyles.chipText,
          isSelected ? genreFilterStyles.chipTextPrimary : genreFilterStyles.chipTextSecondary
        ]}>
          {genre}
        </Text>
      </TouchableOpacity>
    );
  }, [selected, onSelect]);

  return (
    <View style={genreFilterStyles.container}>
      {genres.map(renderGenreChip)}
    </View>
  );
}
