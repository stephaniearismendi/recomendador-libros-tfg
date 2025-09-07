import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native-expo-image-cache';
import { BookCardStyles } from '../styles/components';

export default function BookCard({ id, title, author, rating, image, description }) {
  const navigation = useNavigation();
  
  const bookCover = image || 'https://upload.wikimedia.org/wikipedia/commons/b/b9/No_Cover.jpg';

  return (
    <TouchableOpacity
      style={BookCardStyles.card}
      onPress={() =>
        navigation.navigate('BookDetail', {
          book: { id, title, author, rating, image, description },
        })
      }
    >
      <View style={BookCardStyles.imageContainer}>
        <Image
          uri={bookCover}
          style={BookCardStyles.bookImage}
          resizeMode="cover"
          preview={{ uri: bookCover }}
          tint="light"
        />
      </View>
      
      <View style={BookCardStyles.contentContainer}>
        <Text style={BookCardStyles.bookTitle} numberOfLines={2}>{title}</Text>
        <Text style={BookCardStyles.bookAuthor} numberOfLines={1}>{author}</Text>
        
        {rating && (
          <View style={BookCardStyles.rating}>
            {Number(rating) ? (
              <>
                <MaterialIcons name="star" size={12} color="#FFD700" style={BookCardStyles.star} />
                <Text style={BookCardStyles.ratingText}>{rating}</Text>
              </>
            ) : (
              <Text style={[BookCardStyles.ratingText, { color: '#E63946' }]}>{rating}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
