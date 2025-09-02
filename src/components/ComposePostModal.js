import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from '../styles/socialStyles';

export default function ComposePostModal({ visible, onClose, onSubmit, favorites = [] }) {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(null);

  const favs = useMemo(
    () => (favorites || []).map(b => ({
      id: b.id,
      title: b.title,
      author: b.author || 'Desconocido',
      cover: typeof b.image === 'string' ? b.image : b?.image?.uri || b?.cover || b?.coverUrl || `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`,
    })),
    [favorites]
  );

  const canPost = text.trim().length > 0 || !!selected;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdropCenter}>
        <View style={styles.modalCardWide}>
          <Text style={styles.modalTitle}>Crear publicación</Text>
          <TextInput style={styles.inputMultiline} value={text} onChangeText={setText} placeholder="¿Qué estás leyendo o pensando?" multiline />
          <Text style={styles.modalSubtitle}>Adjuntar desde favoritos</Text>
          <FlatList
            horizontal
            data={favs}
            keyExtractor={(b) => b.id?.toString() || b.title}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.attachList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.attachItem, selected?.id === item.id ? styles.attachItemActive : null]}
                onPress={() => setSelected(selected?.id === item.id ? null : item)}
              >
                <Image source={{ uri: item.cover }} style={styles.attachCover} />
                <Text numberOfLines={1} style={styles.attachTitle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.attachAuthor}>{item.author}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.rowEnd}>
            <TouchableOpacity style={styles.modalCloseTiny} onPress={onClose}><Text style={styles.modalCloseText}>Cerrar</Text></TouchableOpacity>
            <TouchableOpacity
              style={canPost ? styles.modalPrimaryTiny : styles.modalPrimaryTinyDisabled}
              onPress={() => { if (!canPost) return; onSubmit({ text: text.trim(), book: selected ? { title: selected.title, author: selected.author, cover: selected.cover } : null }); setText(''); setSelected(null); }}
            >
              <Text style={styles.modalPrimaryText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
