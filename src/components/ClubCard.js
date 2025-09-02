import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

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
    <View
      style={{
        width: 220,
        marginRight: 14,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#eef2f7',
      }}
    >
      <Image
        source={{ uri: club.cover }}
        style={{ width: '100%', height: 120, borderRadius: 12, backgroundColor: '#eee' }}
      />
      <Text numberOfLines={1} style={{ marginTop: 10, fontWeight: '700', color: '#111827' }}>
        {club.name}
      </Text>
      <Text style={{ color: '#6b7280', marginTop: 2 }}>{members} miembros</Text>
      <TouchableOpacity
        onPress={onPress}
        style={{
          marginTop: 10,
          backgroundColor: isJoined ? '#eef2ff' : '#5A4FFF',
          paddingVertical: 10,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '800',
            color: isJoined ? '#5A4FFF' : '#fff',
          }}
        >
          {isJoined ? 'Salir' : 'Unirse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
