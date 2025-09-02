import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, Image, Platform } from 'react-native';
import styles from '../styles/composeStoryStyles';

const FALLBACK = 'https://covers.openlibrary.org/b/id/240727-M.jpg';

export default function ComposeStoryModal({ visible, onClose, onSubmit, favorites = [] }) {
  const [caption, setCaption] = useState('');
  const [selected, setSelected] = useState(null);

  const favs = useMemo(() => (Array.isArray(favorites) ? favorites : []), [favorites]);

  const coverUri = (b) => {
    const s = typeof b?.image === 'string' ? b.image : null;
    const o = typeof b?.image === 'object' && b?.image?.uri ? b.image.uri : null;
    return s || o || b?.cover || b?.coverUrl || FALLBACK;
  };

  const onConfirm = () => {
    onSubmit({ caption: caption.trim(), book: selected ? { ...selected, cover: coverUri(selected) } : null });
    setCaption('');
    setSelected(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { position: Platform.OS === 'web' ? 'fixed' : 'absolute' }]}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Crear historia</Text>

          <Text style={styles.label}>Texto</Text>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="¿Qué quieres contar?"
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Adjuntar libro de favoritos</Text>
          {favs.length === 0 ? (
            <Text style={styles.hint}>No tienes favoritos todavía.</Text>
          ) : (
            <FlatList
              data={favs}
              horizontal
              keyExtractor={(b) => String(b.id || b.title)}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.bookItem, selected?.id === item.id && styles.bookItemSelected]}
                  onPress={() => setSelected(item)}
                >
                  <Image source={{ uri: coverUri(item) }} style={styles.bookCover} />
                  <Text numberOfLines={1} style={styles.bookTitle}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <View style={styles.rowEnd}>
            <TouchableOpacity style={styles.btnGhost} onPress={onClose}>
              <Text style={styles.btnGhostText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={onConfirm}>
              <Text style={styles.btnPrimaryText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
