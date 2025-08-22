import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const FALLBACK_IMG = 'https://covers.openlibrary.org/b/id/240727-S.jpg';

export default function CurrentlyReadingCard({ title, author, coverUri, progress = 0 }) {
  if (!title) {
    return (
      <View style={styles.cardEmpty}>
        <Text style={styles.emptyTitle}>No hay ningún libro en lectura</Text>
        <Text style={styles.emptySubtitle}>Elige uno de tus favoritos para empezar.</Text>
      </View>
    );
  }

  const pct = Math.max(0, Math.min(100, progress || 0));

  return (
    <View style={styles.card}>
      <Image source={{ uri: coverUri || FALLBACK_IMG }} style={styles.cover} resizeMode="cover" />
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {!!author && <Text style={styles.author} numberOfLines={1}>{author}</Text>}

        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressText}>{pct}%</Text>
        </View>
      </View>
    </View>
  );
}

const RADIUS = 16;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardEmpty: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cover: {
    width: 72,
    height: 108,
    borderRadius: 10,
    backgroundColor: '#EEE',
  },
  meta: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  author: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#5A4FFF',
    borderRadius: 24,
  },
  progressText: {
    fontSize: 12,
    color: '#4F46E5',
    width: 38,
    textAlign: 'right',
  },
});
