import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from '../styles/socialStyles';

export default function CommentSheet({ visible, post, onAdd, onClose }) {
  const [text, setText] = useState('');
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.rowBetween}>
            <Text style={styles.modalTitle}>Comentarios</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.sectionLink}>Cerrar</Text></TouchableOpacity>
          </View>
          {post?.book ? (
            <View style={styles.postBookWrap}>
              <Image source={{ uri: post.book.cover }} style={styles.postBookCover} />
              <View style={styles.postBookInfo}>
                <Text numberOfLines={1} style={styles.postBookTitle}>{post.book.title}</Text>
                <Text numberOfLines={1} style={styles.postBookAuthor}>{post.book.author}</Text>
              </View>
            </View>
          ) : null}
          <FlatList
            data={post?.comments || []}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>{item.user.name}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
          />
          <View style={styles.commentInputRow}>
            <TextInput style={styles.commentInput} value={text} onChangeText={setText} placeholder="Escribe un comentario…" />
            <TouchableOpacity style={styles.chipPrimarySmall} onPress={() => { const t = text.trim(); if (!t) return; onAdd(t); setText(''); }}>
              <Text style={styles.chipPrimaryText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
