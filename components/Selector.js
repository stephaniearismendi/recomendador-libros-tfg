import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Selector({ label }) {
  return (
    <View style={styles.selector}>
      <Text style={styles.selectorText}>{label}</Text>
      <MaterialIcons
        name="keyboard-arrow-down"
        size={28}
        color="#6B7280"
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
    top: 10,
  },
});