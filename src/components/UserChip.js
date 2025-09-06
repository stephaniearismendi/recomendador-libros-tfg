import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/socialStyles';

export default function UserChip({ user, following, onToggleFollow }) {
  const canFollow = user.canFollow !== false; // Default to true if not specified
  const isDemo = user.isDemo || user.id?.startsWith('demo_');
  const label = following ? '✓' : 'Seguir';
  
  return (
    <View style={styles.userChip}>
      <Image source={{ uri: user.avatar }} style={styles.userChipAvatar} />
      <View style={styles.userChipContent}>
        <Text style={styles.userChipName} numberOfLines={1}>
          {user.name}
        </Text>
        {user.bio && (
          <Text style={styles.userChipBio} numberOfLines={1}>
            {user.bio}
          </Text>
        )}
      </View>
      {canFollow ? (
        <TouchableOpacity
          onPress={onToggleFollow}
          style={[
            following ? styles.userChipBtnOutline : styles.userChipBtn,
            isDemo && styles.userChipBtnDemo
          ]}
        >
          <Text style={[
            following ? styles.userChipBtnOutlineText : styles.userChipBtnText,
            isDemo && styles.userChipBtnDemoText
          ]}>
            {label}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userChipBtnDisabled}>
          <Text style={styles.userChipBtnDisabledText}>
            Demo
          </Text>
        </View>
      )}
    </View>
  );
}
