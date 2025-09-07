import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BookCarouselStyles } from '../styles/components';

export default function BookCarousel({
  title = '',
  books = [],
  titleStyle,
  bookTitleStyle,
  authorStyle,
  onPressBook,
  onSeeAll,
  showSeeAll = true,
}) {
  const renderItem = ({ item }) => {
    const src = item?.image?.uri
      ? { uri: item.image.uri }
      : typeof item?.image === 'string'
        ? { uri: item.image }
        : item?.image || { uri: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/No_Cover.jpg' };

    return (
      <TouchableOpacity style={BookCarouselStyles.card} activeOpacity={0.9} onPress={() => onPressBook?.(item)}>
        <View style={BookCarouselStyles.imageContainer}>
          <Image source={src} style={BookCarouselStyles.bookImage} />
        </View>
        
        <View style={BookCarouselStyles.contentContainer}>
          <Text style={[BookCarouselStyles.bookTitle, bookTitleStyle]} numberOfLines={2}>
            {item?.title || 'Sin título'}
          </Text>
          <Text style={[BookCarouselStyles.bookAuthor, authorStyle]} numberOfLines={1}>
            {item?.author || item?.authors?.[0]?.name || 'Autor desconocido'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={BookCarouselStyles.container}>
      <View style={BookCarouselStyles.header}>
        <Text style={[BookCarouselStyles.sectionTitle, titleStyle]}>{title}</Text>
        {showSeeAll && onSeeAll && (
          <TouchableOpacity style={BookCarouselStyles.seeAllBtn} onPress={onSeeAll}>
            <Text style={BookCarouselStyles.seeAllText}>Ver todo</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#6366F1" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={books}
        keyExtractor={(item, idx) =>
          String(
            item?.id ||
              item?.key ||
              item?.olid ||
              item?.workId ||
              item?.isbn?.[0] ||
              item?.title ||
              idx,
          )
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
        renderItem={renderItem}
      />
    </View>
  );
}
