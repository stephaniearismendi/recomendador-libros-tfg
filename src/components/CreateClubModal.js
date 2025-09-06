import React, { useMemo, useState, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/socialStyles';

export default function CreateClubModal({ visible, onClose, favorites = [], onSubmit }) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(null);
  const { user } = useContext(AuthContext);

  const favs = useMemo(
    () => (favorites || []).map(b => ({
      id: b.id,
      title: b.title,
      author: b.author || 'Desconocido',
      cover: typeof b.image === 'string' ? b.image : b?.image?.uri || b?.cover || b?.coverUrl || `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`,
    })),
    [favorites]
  );

  const canCreate = !!selected && (name.trim().length > 0);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdropCenter}>
        <View style={styles.modalCardWide}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalTitle}>Crear club de lectura</Text>
              {user && (
                <Text style={styles.modalSubtitle}>Creado por {user.name || user.username || 'Usuario'}</Text>
              )}
            </View>
            {user ? (
              <View style={styles.modalUserAvatar}>
                <Image 
                  source={{ 
                    uri: `${user.avatar || 'https://i.pravatar.cc/150?u=default'}?v=${Math.random()}&t=${Date.now()}`,
                    cache: 'reload'
                  }} 
                  style={styles.modalAvatarImage}
                />
              </View>
            ) : (
              <View style={styles.modalUserAvatar}>
                <Image 
                  source={{ 
                    uri: `https://i.pravatar.cc/150?u=default?t=${Date.now()}`,
                    cache: 'reload'
                  }} 
                  style={styles.modalAvatarImage}
                />
              </View>
            )}
          </View>

          {favs.length === 0 ? (
            <>
              <Text style={styles.emptyText}>Aún no tienes favoritos para crear un club.</Text>
              <View style={styles.rowEnd}>
                <TouchableOpacity style={styles.modalCloseTiny} onPress={onClose}>
                  <Text style={styles.modalCloseText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalSubtitle}>Elige un libro de favoritos</Text>
              <FlatList
                horizontal
                data={favs}
                keyExtractor={(b) => b.id?.toString() || b.title}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.attachList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.attachItem, selected?.id === item.id ? styles.attachItemActive : null]}
                    onPress={() => { setSelected(item); if (!name) setName(`${item.title} · Club`); }}
                  >
                    <Image source={{ uri: item.cover }} style={styles.attachCover} />
                    <Text numberOfLines={1} style={styles.attachTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.attachAuthor}>{item.author}</Text>
                  </TouchableOpacity>
                )}
              />

              <Text style={styles.modalSubtitle}>Nombre del club</Text>
              <TextInput
                style={styles.inputMultiline}
                value={name}
                onChangeText={setName}
                placeholder="Ej. Las lectoras de domingo"
                multiline={false}
              />

              <View style={styles.rowEnd}>
                <TouchableOpacity style={styles.modalCloseTiny} onPress={onClose}>
                  <Text style={styles.modalCloseText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={canCreate ? styles.modalPrimaryTiny : styles.modalPrimaryTinyDisabled}
                  onPress={() => { if (!canCreate) return; onSubmit({ name: name.trim(), book: selected }); setSelected(null); setName(''); }}
                >
                  <Text style={styles.modalPrimaryText}>Crear</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
