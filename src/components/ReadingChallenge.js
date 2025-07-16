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
      <Text style={styles.progressText}>{`${current} / ${total} libros leídos`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    padding: 0,
    marginBottom: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#3b5998',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    backgroundColor: '#E5E7EB',
    height: 14,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progress: {
    height: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 2,
  },
});
