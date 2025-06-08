import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Selector({ label }) {
  return (
    <View style={styles.selector}>
      <Text style={styles.selectorText}>{label}</Text>
      <Image
        source={require('../assets/icons/down-arrow.png')}
        style={styles.selectorIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    marginBottom: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 15,
    color: '#374151',
  },
  selectorIcon: {
    position: 'absolute',
    right: 12,
    top: 7,
    width: 32,
    height: 32,
  },
});
