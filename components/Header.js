import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/libraryStyles';

export default function Header({ greeting }) {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Image source={require('../assets/icon.png')} style={styles.avatar} />
    </View>
  );
}
