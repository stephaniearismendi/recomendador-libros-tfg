import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createPostStyles } from '../styles/components/CreatePostModalStyles';
import { formatPostPayload, validatePostData, getSafeFavorites } from '../utils/postUtils';

const CreatePostModal = ({ visible, onClose, onSubmit, loading = false, favorites = [] }) => {
  const [text, setText] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookSelector, setShowBookSelector] = useState(false);

  const safeFavorites = getSafeFavorites(favorites);

  const handleSubmit = useCallback(() => {
    if (!validatePostData(text, selectedBook)) {
      Alert.alert('Error', 'Por favor escribe algo en tu publicación');
      return;
    }

    try {
      const postData = formatPostPayload(text, selectedBook);
      onSubmit(postData);
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la publicación');
    }
  }, [text, selectedBook, onSubmit]);

  const handleClose = useCallback(() => {
    setText('');
    setSelectedBook(null);
    setShowBookSelector(false);
    onClose();
  }, [onClose]);

  const handleSelectBook = useCallback((book) => {
    setSelectedBook(book);
    setShowBookSelector(false);
  }, []);

  const renderBookItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={createPostStyles.bookItem}
      onPress={() => handleSelectBook(item)}
    >
      <Image 
        source={{ uri: item.imageUrl || item.image || item.cover }} 
        style={createPostStyles.bookItemCover}
        defaultSource={{ uri: 'https://covers.openlibrary.org/b/id/240727-M.jpg' }}
      />
      <View style={createPostStyles.bookItemInfo}>
        <Text style={createPostStyles.bookItemTitle}>{item.title}</Text>
        <Text style={createPostStyles.bookItemAuthor}>{item.author || 'Autor desconocido'}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  ), [handleSelectBook]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={createPostStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={createPostStyles.header}>
          <TouchableOpacity onPress={handleClose} style={createPostStyles.cancelButton}>
            <Text style={createPostStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={createPostStyles.title}>Nueva Publicación</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[createPostStyles.postButton, loading && createPostStyles.postButtonDisabled]}
            disabled={loading}
          >
            <Text style={[createPostStyles.postText, loading && createPostStyles.postTextDisabled]}>
              {loading ? 'Publicando...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={createPostStyles.content} showsVerticalScrollIndicator={false}>
          <View style={createPostStyles.inputContainer}>
            <Text style={createPostStyles.label}>¿Qué estás leyendo?</Text>
            <TextInput
              style={createPostStyles.textInput}
              placeholder="Comparte tus pensamientos sobre el libro..."
              placeholderTextColor="#A0A0A0"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={createPostStyles.characterCount}>{text.length}/500</Text>
          </View>

          <View style={createPostStyles.bookSection}>
            <Text style={createPostStyles.sectionTitle}>Libro (Opcional)</Text>
            
            {selectedBook ? (
              <View style={createPostStyles.selectedBookContainer}>
                <Image 
                  source={{ uri: selectedBook.imageUrl || selectedBook.image || selectedBook.cover }} 
                  style={createPostStyles.selectedBookCover}
                  defaultSource={{ uri: 'https://covers.openlibrary.org/b/id/240727-M.jpg' }}
                />
                <View style={createPostStyles.selectedBookInfo}>
                  <Text style={createPostStyles.selectedBookTitle}>{selectedBook.title}</Text>
                  <Text style={createPostStyles.selectedBookAuthor}>{selectedBook.author || 'Autor desconocido'}</Text>
                </View>
                <TouchableOpacity 
                  style={createPostStyles.removeBookButton}
                  onPress={() => setSelectedBook(null)}
                >
                  <MaterialIcons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={createPostStyles.selectBookButton}
                onPress={() => setShowBookSelector(true)}
              >
                <MaterialIcons name="book" size={20} color="#5A4FFF" />
                <Text style={createPostStyles.selectBookText}>Seleccionar de mis favoritos</Text>
                <MaterialIcons name="chevron-right" size={20} color="#5A4FFF" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showBookSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBookSelector(false)}
      >
        <View style={createPostStyles.bookSelectorContainer}>
          <View style={createPostStyles.bookSelectorHeader}>
            <TouchableOpacity 
              onPress={() => setShowBookSelector(false)}
              style={createPostStyles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={createPostStyles.bookSelectorTitle}>Mis Favoritos</Text>
            <View style={createPostStyles.placeholder} />
          </View>

          {safeFavorites.length > 0 ? (
            <FlatList
              data={safeFavorites}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderBookItem}
              contentContainerStyle={createPostStyles.bookList}
            />
          ) : (
            <View style={createPostStyles.emptyFavorites}>
              <MaterialIcons name="book" size={48} color="#CCC" />
              <Text style={createPostStyles.emptyFavoritesText}>No tienes libros favoritos</Text>
              <Text style={createPostStyles.emptyFavoritesSubtext}>Agrega libros a tus favoritos para poder mencionarlos en tus posts</Text>
            </View>
          )}
        </View>
      </Modal>
    </Modal>
  );
};

export default CreatePostModal;
