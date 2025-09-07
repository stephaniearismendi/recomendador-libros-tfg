import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ClubCardStyles } from '../styles/components';

export default function ClubCard({ club, joined = false, onToggleJoin }) {
  const [isJoined, setIsJoined] = useState(!!joined);
  const [members, setMembers] = useState(club.members || 0);

  useEffect(() => setIsJoined(!!joined), [joined]);

  const onPress = async () => {
    const next = !isJoined;
    setIsJoined(next);
    setMembers((m) => Math.max(0, m + (next ? 1 : -1)));
    try {
      const res = await onToggleJoin?.(club.id, next);
      if (res?.members !== undefined) setMembers(res.members);
      if (res?.joined !== undefined) setIsJoined(!!res.joined);
    } catch {
      setIsJoined(!next);
      setMembers((m) => Math.max(0, m + (!next ? 1 : -1)));
    }
  };

  return (
    <View style={ClubCardStyles.container}>
      <Image
        source={{ uri: club.cover }}
        style={ClubCardStyles.coverImage}
      />
      <Text numberOfLines={1} style={ClubCardStyles.clubName}>
        {club.name}
      </Text>
      <Text style={ClubCardStyles.memberCount}>{members} miembros</Text>
      <TouchableOpacity
        onPress={onPress}
        style={[
          ClubCardStyles.joinButton,
          isJoined ? ClubCardStyles.joinButtonJoined : ClubCardStyles.joinButtonNotJoined,
        ]}
      >
        <Text
          style={[
            ClubCardStyles.joinButtonText,
            isJoined ? ClubCardStyles.joinButtonTextJoined : ClubCardStyles.joinButtonTextNotJoined,
          ]}
        >
          {isJoined ? 'Salir' : 'Unirse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
