import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function CurrentlyReadingCard({ book }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Currently Reading</Text>
      <Text style={styles.chapter}>{book.chapter}</Text>

      <View style={styles.bookContainer}>
        <Image source={book.image} style={styles.cover} />
        <View style={styles.info}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
          <Text style={styles.timeLeft}>{book.timeLeft}</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progress, { width: `${book.progress}%` }]} />
        <Text style={styles.progressLabel}>{book.progress}% Complete</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E7ECFD',
    borderRadius: 16,
    padding: 20,
    marginBottom: 0, 
    width: '100%',   
    alignSelf: 'center',
    elevation: 0,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  chapter: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
  },
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
  },
  author: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  continueText: {
    color: '#FFF',
    fontSize: 12,
  },
  timeLeft: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  progressBarContainer: {
    marginTop: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 20,
    height: 6,
    position: 'relative',
  },
  progress: {
    backgroundColor: '#6366F1',
    height: 6,
    borderRadius: 20,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressLabel: {
    fontSize: 10,
    color: '#4F46E5',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
