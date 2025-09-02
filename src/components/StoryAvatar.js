import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/socialStyles';

export default function StoryAvatar({ name, avatarUri, active, onPress }) {
  return (
    <TouchableOpacity style={styles.storyWrap} onPress={onPress}>
      <View style={[styles.storyImageWrap, active ? styles.storyActive : null]}>
        <Image source={{ uri: avatarUri }} style={styles.storyImage} />
      </View>
      <Text numberOfLines={1} style={styles.storyName}>{name}</Text>
    </TouchableOpacity>
  );
}
