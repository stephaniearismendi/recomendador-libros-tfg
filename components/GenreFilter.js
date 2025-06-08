import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GenreFilter() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.primary}>
        <Text style={styles.primaryText}>Todos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary}>
        <Text style={styles.secondaryText}>Ficción</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary}>
        <Text style={styles.secondaryText}>Misterio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary}>
        <Text style={styles.secondaryText}>Romántica</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  primary: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  secondary: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  secondaryText: {
    color: '#1F2937',
    fontSize: 13,
  },
});
