import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/libraryStyles';

const AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/150?u=default';

export default function Header({ greeting, user, onProfilePress }) {
  const { user: authUser } = useContext(AuthContext);
  const userData = user || authUser;
  const userAvatar = userData?.avatar || AVATAR_PLACEHOLDER;
  const userName = userData?.name || userData?.username || 'Usuario';

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={styles.avatarBadge}>
            <MaterialIcons name="person" size={12} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
