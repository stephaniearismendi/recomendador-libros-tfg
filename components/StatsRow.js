import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsRow({ stats }) {
  return (
    <View style={styles.container}>
      <Stat label="Books Read" value={stats.read} />
      <Stat label="Reading Time" value={stats.time} />
      <Stat label="To Read" value={stats.toRead} />
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1F2937',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
});
