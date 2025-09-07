import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/postCardStyles';
import { baseStyles, COLORS, TYPOGRAPHY } from '../styles/baseStyles';

export default function PostCard({ post, onLike, onOpenComments, onUnfollow, onBookPress, onDelete, currentUserId }) {
  const user = post?.user || {};
  const avatar = user.avatar || `https://i.pravatar.cc/100?u=${user.id || 'unknown'}`;
  const name = user.name || 'Usuario';
  const [showMenu, setShowMenu] = useState(false);
  
  const isOwnPost = currentUserId && user.id === String(currentUserId);
  
  // Debug log para verificar la comparación
  console.log('🔍 PostCard - Post ownership check:', {
    postId: post.id,
    userId: user.id,
    currentUserId,
    userIdType: typeof user.id,
    currentUserIdType: typeof currentUserId,
    isOwnPost,
    comparison: `${user.id} === ${String(currentUserId)}`
  });

  const handleDeletePost = () => {
    Alert.alert(
      'Eliminar publicación',
      '¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onDelete && onDelete(post.id);
            setShowMenu(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>hoy</Text>
        </View>
        {isOwnPost ? (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="more-vert" size={20} color="#666" />
          </TouchableOpacity>
        ) : onUnfollow ? (
          <TouchableOpacity 
            style={styles.unfollowButton}
            onPress={() => onUnfollow(user.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.unfollowText}>Dejar de seguir</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {post?.text ? <Text style={styles.text}>{post.text}</Text> : null}

      {post?.book ? (
        <TouchableOpacity 
          style={styles.bookBox}
          onPress={() => {
            console.log('📚 PostCard - Book box pressed:', post.book);
            onBookPress && onBookPress(post.book);
          }}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: post.book.cover || 'https://covers.openlibrary.org/b/id/240727-M.jpg' }} 
            style={styles.bookCover}
            onError={(error) => console.log('❌ Image load error:', error.nativeEvent.error)}
            onLoad={() => console.log('✅ Image loaded successfully')}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle}>{post.book.title}</Text>
            <Text style={styles.bookAuthor}>{post.book.author}</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.footer}>
        <TouchableOpacity onPress={onLike} style={styles.btn}>
          <Text style={styles.btnText}>❤️ {post.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenComments} style={styles.btn}>
          <Text style={styles.btnText}>💬 {(post.comments || []).length}</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDeletePost}
            >
              <MaterialIcons name="delete" size={20} color="#E63946" />
              <Text style={styles.deleteText}>Eliminar publicación</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
