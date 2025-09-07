import React, { useState, useContext, useCallback } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Image, Platform, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { createClubStyles } from '../styles/components/CreateClubModalStyles';
import { getBookCoverUri, validateBookData } from '../utils/imageUtils';
import { getUserDisplayName, getAvatarWithCache } from '../utils/userUtils';

export default function CreateClubModal({ visible, onClose, favorites = [], onSubmit }) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(null);
  const [chapters, setChapters] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const safeFavorites = Array.isArray(favorites) 
    ? favorites.filter(validateBookData).map(book => ({
        ...book,
        author: book.author || 'Desconocido',
        cover: getBookCoverUri(book)
      }))
    : [];

  const canCreate = selected && name.trim().length >= 3 && !isLoading;

  const handleBookSelect = useCallback((item) => {
    setSelected(item);
    if (!name.trim()) {
      setName(`${item.title} · Club`);
    }
  }, [name]);

  const handleSubmit = useCallback(async () => {
    if (!canCreate) return;
    
    setIsLoading(true);
    
    try {
      const clubData = { 
        name: name.trim(), 
        book: selected,
        chapters: parseInt(chapters, 10) || 0
      };
      
      await onSubmit(clubData);
      setSelected(null);
      setName('');
      setChapters('0');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el club');
    } finally {
      setIsLoading(false);
    }
  }, [canCreate, name, selected, chapters, onSubmit]);

  const renderBookItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        createClubStyles.bookItem,
        selected?.id === item.id && createClubStyles.bookItemSelected
      ]}
      onPress={() => handleBookSelect(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.cover }} 
        style={createClubStyles.bookCover}
        resizeMode="cover"
      />
      <Text numberOfLines={2} style={createClubStyles.bookTitle}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={createClubStyles.bookAuthor}>
        {item.author}
      </Text>
    </TouchableOpacity>
  ), [selected, handleBookSelect]);

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <View style={[
        createClubStyles.backdrop,
        { position: Platform.OS === 'web' ? 'fixed' : 'absolute' }
      ]}>
        <View style={createClubStyles.sheet}>
          <View style={createClubStyles.header}>
            <View style={createClubStyles.headerInfo}>
              <Text style={createClubStyles.title}>Crear club de lectura</Text>
              <Text style={createClubStyles.subtitle}>
                Creado por {getUserDisplayName(user)}
              </Text>
            </View>
            <View style={createClubStyles.userAvatar}>
              <Image 
                source={{ 
                  uri: getAvatarWithCache(user),
                  cache: 'reload'
                }} 
                style={createClubStyles.avatarImage}
              />
            </View>
          </View>

          {safeFavorites.length === 0 ? (
            <View style={createClubStyles.emptyContainer}>
              <Text style={createClubStyles.emptyText}>
                Aún no tienes favoritos para crear un club
              </Text>
              <TouchableOpacity 
                style={[createClubStyles.button, createClubStyles.buttonSecondary]} 
                onPress={onClose}
              >
                <Text style={[createClubStyles.buttonText, createClubStyles.buttonTextSecondary]}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View>
                <Text style={createClubStyles.sectionTitle}>Elige un libro de favoritos</Text>
                <FlatList
                  horizontal
                  data={safeFavorites}
                  keyExtractor={(book) => String(book.id || book.title)}
                  showsHorizontalScrollIndicator={false}
                  style={createClubStyles.bookList}
                  renderItem={renderBookItem}
                />
              </View>

              <View>
                <Text style={createClubStyles.sectionTitle}>Nombre del club</Text>
                <TextInput
                  style={createClubStyles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ej. Las lectoras de domingo"
                  maxLength={50}
                />
              </View>

              <View>
                <Text style={createClubStyles.sectionTitle}>Número de capítulos (opcional)</Text>
                <TextInput
                  style={createClubStyles.input}
                  value={chapters}
                  onChangeText={setChapters}
                  placeholder="0"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              <View style={createClubStyles.actions}>
                <TouchableOpacity 
                  style={[createClubStyles.button, createClubStyles.buttonSecondary]} 
                  onPress={onClose}
                >
                  <Text style={[createClubStyles.buttonText, createClubStyles.buttonTextSecondary]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    createClubStyles.button, 
                    canCreate ? createClubStyles.buttonPrimary : createClubStyles.buttonPrimaryDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!canCreate}
                >
                  <Text style={[createClubStyles.buttonText, createClubStyles.buttonTextPrimary]}>
                    {isLoading ? 'Creando...' : 'Crear'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
