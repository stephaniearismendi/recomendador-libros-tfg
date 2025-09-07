import React, { useCallback } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { storyAvatarStyles } from '../styles/components';
import { getUserAvatar, getUserDisplayName } from '../utils/userUtils';

export default function StoryAvatar({ name, avatarUri, active = false, onPress }) {
  const safeAvatar = getUserAvatar({ avatar: avatarUri });
  const safeName = getUserDisplayName({ name });

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  return (
    <TouchableOpacity style={storyAvatarStyles.wrap} onPress={handlePress} activeOpacity={0.7}>
      <View style={[storyAvatarStyles.imageWrap, active && storyAvatarStyles.active]}>
        <Image 
          source={{ uri: safeAvatar }} 
          style={storyAvatarStyles.image}
          resizeMode="cover"
        />
      </View>
      <Text numberOfLines={1} style={storyAvatarStyles.name}>
        {safeName}
      </Text>
    </TouchableOpacity>
  );
}
