import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getBookDetails } from '../api/api';


export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const navigation = useNavigation();
  const [details, setDetails] = useState({ description: '', rating: null });
  const [loading, setLoading] = useState(true);

useEffect(() => {
  console.log('book:', book);
  const fetchDetails = async () => {
    try {
      const response = await getBookDetails(book.id);
      setDetails(response.data);
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchDetails();
}, [book.id]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#3b5998" />
      </TouchableOpacity>

      <Image source={{ uri: book.image }} style={styles.cover} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>por {book.author}</Text>

      <View style={styles.ratingRow}>
        <MaterialIcons name="star" size={20} color="#FFD700" />
        <Text style={styles.ratingText}>
          {loading ? '...' : details.rating || '4.5'}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#888" />
      ) : (
        <Text style={styles.description}>
          {details.description || 'No hay descripción disponible.'}
        </Text>
      )}

      <TouchableOpacity style={styles.favButton}>
        <MaterialIcons name="favorite-border" size={22} color="#e63946" />
        <Text style={styles.favButtonText}>Agregar a Favoritos</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    padding: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  cover: {
    width: 160,
    height: 230,
    borderRadius: 12,
    marginTop: 60,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#3b5998',
    marginLeft: 6,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    elevation: 2,
  },
  favButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#e63946',
    marginLeft: 8,
  },
});