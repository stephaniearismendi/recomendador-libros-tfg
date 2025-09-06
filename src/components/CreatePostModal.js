import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CreatePostModal = ({ visible, onClose, onSubmit, loading = false, favorites = [] }) => {
  const [text, setText] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookSelector, setShowBookSelector] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Por favor escribe algo en tu publicación');
      return;
    }

    const postData = {
      text: text.trim(),
      book: selectedBook ? {
        title: selectedBook.title,
        author: selectedBook.author || 'Autor desconocido',
        cover: selectedBook.imageUrl || selectedBook.image || selectedBook.cover,
      } : null,
    };

    onSubmit(postData);
    handleClose();
  };

  const handleClose = () => {
    setText('');
    setSelectedBook(null);
    setShowBookSelector(false);
    onClose();
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setShowBookSelector(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nueva Publicación</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.postButton, loading && styles.postButtonDisabled]}
            disabled={loading}
          >
            <Text style={[styles.postText, loading && styles.postTextDisabled]}>
              {loading ? 'Publicando...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>¿Qué estás leyendo?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Comparte tus pensamientos sobre el libro..."
              placeholderTextColor="#A0A0A0"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{text.length}/500</Text>
          </View>

          <View style={styles.bookSection}>
            <Text style={styles.sectionTitle}>Libro (Opcional)</Text>
            
            {selectedBook ? (
              <View style={styles.selectedBookContainer}>
                <Image 
                  source={{ uri: selectedBook.imageUrl || selectedBook.image || selectedBook.cover }} 
                  style={styles.selectedBookCover}
                  defaultSource={{ uri: 'https://covers.openlibrary.org/b/id/240727-M.jpg' }}
                />
                <View style={styles.selectedBookInfo}>
                  <Text style={styles.selectedBookTitle}>{selectedBook.title}</Text>
                  <Text style={styles.selectedBookAuthor}>{selectedBook.author || 'Autor desconocido'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeBookButton}
                  onPress={() => setSelectedBook(null)}
                >
                  <MaterialIcons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.selectBookButton}
                onPress={() => setShowBookSelector(true)}
              >
                <MaterialIcons name="book" size={20} color="#5A4FFF" />
                <Text style={styles.selectBookText}>Seleccionar de mis favoritos</Text>
                <MaterialIcons name="chevron-right" size={20} color="#5A4FFF" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Book Selector Modal */}
      <Modal
        visible={showBookSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBookSelector(false)}
      >
        <View style={styles.bookSelectorContainer}>
          <View style={styles.bookSelectorHeader}>
            <TouchableOpacity 
              onPress={() => setShowBookSelector(false)}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.bookSelectorTitle}>Mis Favoritos</Text>
            <View style={styles.placeholder} />
          </View>

          {favorites.length > 0 ? (
            <FlatList
              data={favorites}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.bookItem}
                  onPress={() => handleSelectBook(item)}
                >
                  <Image 
                    source={{ uri: item.imageUrl || item.image || item.cover }} 
                    style={styles.bookItemCover}
                    defaultSource={{ uri: 'https://covers.openlibrary.org/b/id/240727-M.jpg' }}
                  />
                  <View style={styles.bookItemInfo}>
                    <Text style={styles.bookItemTitle}>{item.title}</Text>
                    <Text style={styles.bookItemAuthor}>{item.author || 'Autor desconocido'}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.bookList}
            />
          ) : (
            <View style={styles.emptyFavorites}>
              <MaterialIcons name="book" size={48} color="#CCC" />
              <Text style={styles.emptyFavoritesText}>No tienes libros favoritos</Text>
              <Text style={styles.emptyFavoritesSubtext}>Agrega libros a tus favoritos para poder mencionarlos en tus posts</Text>
            </View>
          )}
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  postButton: {
    backgroundColor: '#5A4FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#CCC',
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  postTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  bookSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  bookInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  
  // Book selector styles
  selectBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  selectBookText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#5A4FFF',
    fontFamily: 'Poppins-Medium',
  },
  
  selectedBookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#5A4FFF',
    borderRadius: 12,
    backgroundColor: '#F0F0FF',
  },
  selectedBookCover: {
    width: 50,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  selectedBookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedBookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  selectedBookAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  removeBookButton: {
    padding: 8,
  },
  
  // Book selector modal styles
  bookSelectorContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bookSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  bookSelectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  placeholder: {
    width: 40,
  },
  
  bookList: {
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bookItemCover: {
    width: 40,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },
  bookItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  bookItemAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  
  emptyFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
});

export default CreatePostModal;
