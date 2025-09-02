import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/socialStyles';

export default function UserChip({ user, following, onToggleFollow }) {
  const label = following ? 'Siguiendo' : 'Seguir';
  return (
    <View style={styles.userChip}>
      <Image source={{ uri: user.avatar }} style={styles.userChipAvatar} />
      <Text style={styles.userChipName} numberOfLines={1}>
        {user.name}
      </Text>
      <TouchableOpacity
        onPress={onToggleFollow}
        style={following ? styles.userChipBtnOutline : styles.userChipBtn}
      >
        <Text style={following ? styles.userChipBtnOutlineText : styles.userChipBtnText}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
