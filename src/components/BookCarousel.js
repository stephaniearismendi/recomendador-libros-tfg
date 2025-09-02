import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookCarousel({
  title = '',
  books = [],
  titleStyle,
  bookTitleStyle,
  authorStyle,
  onPressBook,
  onSeeAll,
}) {
  const renderItem = ({ item }) => {
    const src = item?.image?.uri
      ? { uri: item.image.uri }
      : typeof item?.image === 'string'
        ? { uri: item.image }
        : item?.image || { uri: 'https://covers.openlibrary.org/b/id/240727-M.jpg' };

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPressBook?.(item)}>
        <Image source={src} style={styles.bookImage} />
        <Text style={[styles.bookTitle, bookTitleStyle]} numberOfLines={2}>
          {item?.title || 'Sin título'}
        </Text>
        <Text style={[styles.bookAuthor, authorStyle]} numberOfLines={1}>
          {item?.author || item?.authors?.[0]?.name || 'Autor desconocido'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
        <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>Ver todo</Text>
          <MaterialIcons name="arrow-forward-ios" size={14} color="#6366F1" />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#3b5998' },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  seeAllText: { color: '#6366F1', fontSize: 13, fontFamily: 'Poppins-Medium', marginRight: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 10,
    marginRight: 16,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  bookImage: {
    width: 92,
    height: 132,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 0,
  },
  bookAuthor: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 0,
  },
});
