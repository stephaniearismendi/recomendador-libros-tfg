import React, { useContext, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { headerStyles } from '../styles/components/HeaderStyles';
import { getUserAvatar, getUserDisplayName } from '../utils/userUtils';

export default function Header({ greeting, user, onProfilePress }) {
  const { user: authUser } = useContext(AuthContext);
  const userData = user || authUser;
  
  const userAvatar = getUserAvatar(userData);
  const userName = getUserDisplayName(userData);

  const handleProfilePress = useCallback(() => {
    if (onProfilePress) {
      onProfilePress();
    }
  }, [onProfilePress]);

  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerContent}>
        <View style={headerStyles.greetingContainer}>
          <Text style={headerStyles.greeting}>{greeting}</Text>
          <Text style={headerStyles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: userAvatar }} 
            style={headerStyles.avatar}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
