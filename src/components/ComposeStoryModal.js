import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, Image, Platform, Alert } from 'react-native';
import { modalStyles } from '../styles/components/ModalStyles';
import { getBookCoverUri, validateBookData } from '../utils/imageUtils';

export default function ComposeStoryModal({ visible, onClose, onSubmit, favorites = [] }) {
  const [caption, setCaption] = useState('');
  const [selected, setSelected] = useState(null);

  const safeFavorites = Array.isArray(favorites) ? favorites.filter(validateBookData) : [];

  const handleSubmit = useCallback(() => {
    const trimmedCaption = caption.trim();
    
    if (!trimmedCaption && !selected) {
      Alert.alert('Error', 'Debes escribir algo o seleccionar un libro');
      return;
    }

    try {
      onSubmit({ 
        caption: trimmedCaption, 
        book: selected ? { 
          ...selected, 
          cover: getBookCoverUri(selected) 
        } : null 
      });
      setCaption('');
      setSelected(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar la historia');
    }
  }, [caption, selected, onSubmit]);

  const handleBookSelect = useCallback((item) => {
    setSelected(prev => prev?.id === item.id ? null : item);
  }, []);

  const renderBookItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        modalStyles.bookItem,
        selected?.id === item.id && modalStyles.bookItemSelected
      ]}
      onPress={() => handleBookSelect(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: getBookCoverUri(item) }} 
        style={modalStyles.bookCover}
        resizeMode="cover"
      />
      <Text numberOfLines={2} style={modalStyles.bookTitle}>
        {item.title}
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
        modalStyles.backdrop,
        { position: Platform.OS === 'web' ? 'fixed' : 'absolute' }
      ]}>
        <View style={modalStyles.sheet}>
          <Text style={modalStyles.title}>Crear historia</Text>

          <View>
            <Text style={modalStyles.label}>Texto</Text>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="¿Qué quieres contar?"
              style={modalStyles.input}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text style={modalStyles.label}>Adjuntar libro</Text>
            {safeFavorites.length === 0 ? (
              <Text style={modalStyles.hint}>No tienes favoritos todavía</Text>
            ) : (
              <FlatList
                data={safeFavorites}
                horizontal
                keyExtractor={(book) => String(book.id || book.title)}
                showsHorizontalScrollIndicator={false}
                style={modalStyles.bookList}
                renderItem={renderBookItem}
              />
            )}
          </View>

          <View style={modalStyles.actions}>
            <TouchableOpacity 
              style={[modalStyles.button, modalStyles.buttonSecondary]} 
              onPress={onClose}
            >
              <Text style={[modalStyles.buttonText, modalStyles.buttonTextSecondary]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[modalStyles.button, modalStyles.buttonPrimary]} 
              onPress={handleSubmit}
            >
              <Text style={[modalStyles.buttonText, modalStyles.buttonTextPrimary]}>
                Publicar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
