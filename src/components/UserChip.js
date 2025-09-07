import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { userChipStyles } from '../styles/components';
import { getUserAvatar, getUserDisplayName } from '../utils/userUtils';
import { 
  canUserFollow, 
  isDemoUser, 
  getFollowButtonLabel, 
  getFollowButtonStyle,
  getSafeBio 
} from '../utils/userChipUtils';

export default function UserChip({ user, following = false, onToggleFollow }) {
  if (!user) return null;

  const safeUser = {
    avatar: getUserAvatar(user),
    name: getUserDisplayName(user),
    bio: getSafeBio(user.bio),
    canFollow: canUserFollow(user),
    isDemo: isDemoUser(user)
  };

  const buttonStyle = getFollowButtonStyle(following, safeUser.isDemo);
  const buttonLabel = getFollowButtonLabel(following);

  const handleToggleFollow = useCallback(() => {
    if (onToggleFollow && safeUser.canFollow) {
      onToggleFollow();
    }
  }, [onToggleFollow, safeUser.canFollow]);

  const renderButton = () => {
    if (!safeUser.canFollow) {
      return (
        <View style={userChipStyles.buttonDisabled}>
          <Text style={userChipStyles.buttonDisabledText}>Demo</Text>
        </View>
      );
    }

    const buttonStyles = [
      userChipStyles.button,
      buttonStyle === 'outline' && userChipStyles.buttonOutline,
      buttonStyle === 'demo' && userChipStyles.buttonDemo
    ];

    const textStyles = [
      userChipStyles.buttonText,
      buttonStyle === 'outline' && userChipStyles.buttonOutlineText,
      buttonStyle === 'demo' && userChipStyles.buttonDemoText
    ];

    return (
      <TouchableOpacity style={buttonStyles} onPress={handleToggleFollow} activeOpacity={0.7}>
        <Text style={textStyles}>{buttonLabel}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={userChipStyles.container}>
      <Image source={{ uri: safeUser.avatar }} style={userChipStyles.avatar} resizeMode="cover" />
      <View style={userChipStyles.content}>
        <Text style={userChipStyles.name} numberOfLines={1}>
          {safeUser.name}
        </Text>
        {safeUser.bio && (
          <Text style={userChipStyles.bio} numberOfLines={1}>
            {safeUser.bio}
          </Text>
        )}
      </View>
      {renderButton()}
    </View>
  );
}
