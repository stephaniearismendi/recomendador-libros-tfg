import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsRow({ stats = {} }) {
  const read = stats.read ?? 0;
  const inProgress = stats.inProgress ?? stats.reading ?? 0;
  const toRead = stats.toRead ?? 0;

  return (
    <View style={styles.card}>
      <Stat label="Leídos" value={read} />
      <Divider />
      <Stat label="En curso" value={inProgress} />
      <Divider />
      <Stat label="Por leer" value={toRead} />
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

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  value: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#3b5998',
    marginBottom: 2,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
    opacity: 0.8,
    marginHorizontal: 6,
    borderRadius: 1,
  },
});
