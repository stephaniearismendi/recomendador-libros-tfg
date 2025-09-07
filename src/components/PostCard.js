import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { postCardStyles } from '../styles/components/PostCardStyles';
import { formatPostUser, formatPostBook, isPostOwner, formatTimeAgo, getPostStats } from '../utils/postCardUtils';

export default function PostCard({ post, onLike, onOpenComments, onUnfollow, onBookPress, onDelete, currentUserId }) {
  const [showMenu, setShowMenu] = useState(false);
  
  const userData = formatPostUser(post?.user);
  const bookData = formatPostBook(post?.book);
  const isOwnPost = isPostOwner(post?.user?.id, currentUserId);
  const stats = getPostStats(post);

  const handleDeletePost = useCallback(() => {
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
            onDelete?.(post.id);
            setShowMenu(false);
          },
        },
      ]
    );
  }, [onDelete, post.id]);

  const handleBookPress = useCallback(() => {
    onBookPress?.(bookData);
  }, [onBookPress, bookData]);

  const handleUnfollow = useCallback(() => {
    onUnfollow?.(post?.user?.id);
  }, [onUnfollow, post?.user?.id]);

  return (
    <View style={postCardStyles.card}>
      <View style={postCardStyles.header}>
        <Image 
          source={{ uri: userData.avatar }} 
          style={postCardStyles.avatar}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <Text style={postCardStyles.name}>{userData.name}</Text>
          <Text style={postCardStyles.time}>{formatTimeAgo(post?.time)}</Text>
        </View>
        {isOwnPost ? (
          <TouchableOpacity 
            style={postCardStyles.menuButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="more-vert" size={20} color="#666" />
          </TouchableOpacity>
        ) : onUnfollow ? (
          <TouchableOpacity 
            style={postCardStyles.unfollowButton}
            onPress={handleUnfollow}
            activeOpacity={0.7}
          >
            <Text style={postCardStyles.unfollowText}>Dejar de seguir</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {post?.text && <Text style={postCardStyles.text}>{post.text}</Text>}

      {bookData && (
        <TouchableOpacity 
          style={postCardStyles.bookBox}
          onPress={handleBookPress}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: bookData.cover }} 
            style={postCardStyles.bookCover}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={postCardStyles.bookTitle}>{bookData.title}</Text>
            <Text style={postCardStyles.bookAuthor}>{bookData.author}</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={postCardStyles.footer}>
        <TouchableOpacity onPress={onLike} style={postCardStyles.btn}>
          <Text style={postCardStyles.btnText}>❤️ {stats.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenComments} style={postCardStyles.btn}>
          <Text style={postCardStyles.btnText}>💬 {stats.comments}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={postCardStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={postCardStyles.menuContainer}>
            <TouchableOpacity 
              style={postCardStyles.menuItem}
              onPress={handleDeletePost}
            >
              <MaterialIcons name="delete" size={20} color="#E63946" />
              <Text style={postCardStyles.deleteText}>Eliminar publicación</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
