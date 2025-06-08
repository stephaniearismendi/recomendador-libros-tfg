import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReadingChallenge({ title, current, total }) {
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{`${current}/${total}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    backgroundColor: '#E5E7EB',
    height: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progress: {
    height: 8,
    backgroundColor: '#F59E0B',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
});
