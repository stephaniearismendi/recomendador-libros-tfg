import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { CommentSheetStyles } from '../styles/components';

export default function CommentSheet({ visible, post, onAdd, onClose }) {
  const [text, setText] = useState('');

  const handleSendComment = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    onAdd(trimmedText);
    setText('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={CommentSheetStyles.modalBackdrop}>
        <View style={CommentSheetStyles.modalSheet}>
          <View style={CommentSheetStyles.rowBetween}>
            <Text style={CommentSheetStyles.modalTitle}>Comentarios</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={CommentSheetStyles.sectionLink}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          
          {post?.book && (
            <View style={CommentSheetStyles.postBookWrap}>
              <Image source={{ uri: post.book.cover }} style={CommentSheetStyles.postBookCover} />
              <View style={CommentSheetStyles.postBookInfo}>
                <Text numberOfLines={1} style={CommentSheetStyles.postBookTitle}>
                  {post.book.title}
                </Text>
                <Text numberOfLines={1} style={CommentSheetStyles.postBookAuthor}>
                  {post.book.author}
                </Text>
              </View>
            </View>
          )}
          
          <FlatList
            data={post?.comments || []}
            keyExtractor={(comment) => comment.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={CommentSheetStyles.commentItem}>
                <Image source={{ uri: item.user.avatar }} style={CommentSheetStyles.commentAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={CommentSheetStyles.commentUser}>{item.user.name}</Text>
                  <Text style={CommentSheetStyles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
          />
          
          <View style={CommentSheetStyles.commentInputRow}>
            <TextInput 
              style={CommentSheetStyles.commentInput} 
              value={text} 
              onChangeText={setText} 
              placeholder="Escribe un comentario…" 
            />
            <TouchableOpacity style={CommentSheetStyles.chipPrimarySmall} onPress={handleSendComment}>
              <Text style={CommentSheetStyles.chipPrimaryText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
