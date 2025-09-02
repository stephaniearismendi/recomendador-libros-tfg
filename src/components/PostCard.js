import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/postCardStyles';

export default function PostCard({ post, onLike, onOpenComments }) {
  const user = post?.user || {};
  const avatar = user.avatar || `https://i.pravatar.cc/100?u=${user.id || 'unknown'}`;
  const name = user.name || 'Usuario';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>hoy</Text>
        </View>
      </View>

      {post?.text ? <Text style={styles.text}>{post.text}</Text> : null}

      {post?.book ? (
        <View style={styles.bookBox}>
          <Image source={{ uri: post.book.cover }} style={styles.bookCover} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle}>{post.book.title}</Text>
            <Text style={styles.bookAuthor}>{post.book.author}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.footer}>
        <TouchableOpacity onPress={onLike} style={styles.btn}>
          <Text style={styles.btnText}>❤️ {post.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenComments} style={styles.btn}>
          <Text style={styles.btnText}>💬 {(post.comments || []).length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
