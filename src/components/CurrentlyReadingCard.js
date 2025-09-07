import React from 'react';
import { View, Text, Image } from 'react-native';
import { currentlyReadingStyles } from '../styles/components/CurrentlyReadingCardStyles';
import { formatBookData, getProgressPercentage, hasValidBook } from '../utils/readingUtils';

export default function CurrentlyReadingCard({ title, author, coverUri, progress = 0 }) {
  const bookData = formatBookData({ title, author, cover: coverUri });
  
  if (!hasValidBook(bookData)) {
    return (
      <View style={currentlyReadingStyles.cardEmpty}>
        <Text style={currentlyReadingStyles.emptyTitle}>No hay ningún libro en lectura</Text>
        <Text style={currentlyReadingStyles.emptySubtitle}>Elige uno de tus favoritos para empezar.</Text>
      </View>
    );
  }

  const progressPercentage = getProgressPercentage(progress);

  return (
    <View style={currentlyReadingStyles.card}>
      <Image 
        source={{ uri: bookData.cover }} 
        style={currentlyReadingStyles.cover} 
        resizeMode="cover" 
      />
      <View style={currentlyReadingStyles.meta}>
        <Text style={currentlyReadingStyles.title} numberOfLines={2}>
          {bookData.title}
        </Text>
        {bookData.author && (
          <Text style={currentlyReadingStyles.author} numberOfLines={1}>
            {bookData.author}
          </Text>
        )}

        <View style={currentlyReadingStyles.progressWrap}>
          <View style={currentlyReadingStyles.progressBg}>
            <View 
              style={[
                currentlyReadingStyles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={currentlyReadingStyles.progressText}>
            {progressPercentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}
