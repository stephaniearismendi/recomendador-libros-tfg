import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsRow({ stats }) {
  return (
    <View style={styles.card}>
      <Stat label="Leídos" value={stats.read} />
      <Stat label="Tiempo" value={stats.time} />
      <Stat label="Por leer" value={stats.toRead} />
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
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
});