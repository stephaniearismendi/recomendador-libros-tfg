import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { ComposePostModalStyles } from '../styles/components';

export default function ComposePostModal({ visible, onClose, onSubmit, favorites = [] }) {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(null);

  const favs = useMemo(
    () => (favorites || []).map(book => ({
      id: book.id,
      title: book.title,
      author: book.author || 'Desconocido',
      cover: typeof book.image === 'string' 
        ? book.image 
        : book?.image?.uri || book?.cover || book?.coverUrl || `https://upload.wikimedia.org/wikipedia/commons/b/b9/No_Cover.jpg`,
    })),
    [favorites]
  );

  const canPost = text.trim().length > 0 || !!selected;

  const handleSubmit = () => {
    if (!canPost) return;
    onSubmit({ 
      text: text.trim(), 
      book: selected ? { 
        id: selected.id,
        title: selected.title, 
        author: selected.author, 
        cover: selected.cover 
      } : null 
    });
    setText('');
    setSelected(null);
  };

  const handleBookSelect = (item) => {
    setSelected(selected?.id === item.id ? null : item);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={ComposePostModalStyles.modalBackdropCenter}>
        <View style={ComposePostModalStyles.modalCardWide}>
          <Text style={ComposePostModalStyles.modalTitle}>Crear publicación</Text>
          <TextInput 
            style={ComposePostModalStyles.inputMultiline} 
            value={text} 
            onChangeText={setText} 
            placeholder="¿Qué estás leyendo o pensando?" 
            multiline 
          />
          <Text style={ComposePostModalStyles.modalSubtitle}>Adjuntar desde favoritos</Text>
          <FlatList
            horizontal
            data={favs}
            keyExtractor={(book) => book.id?.toString() || book.title}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={ComposePostModalStyles.attachList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  ComposePostModalStyles.attachItem, 
                  selected?.id === item.id ? ComposePostModalStyles.attachItemActive : null
                ]}
                onPress={() => handleBookSelect(item)}
              >
                <Image source={{ uri: item.cover }} style={ComposePostModalStyles.attachCover} />
                <Text numberOfLines={1} style={ComposePostModalStyles.attachTitle}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={ComposePostModalStyles.attachAuthor}>
                  {item.author}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={ComposePostModalStyles.rowEnd}>
            <TouchableOpacity style={ComposePostModalStyles.modalCloseTiny} onPress={onClose}>
              <Text style={ComposePostModalStyles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={canPost ? ComposePostModalStyles.modalPrimaryTiny : ComposePostModalStyles.modalPrimaryTinyDisabled}
              onPress={handleSubmit}
            >
              <Text style={ComposePostModalStyles.modalPrimaryText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
