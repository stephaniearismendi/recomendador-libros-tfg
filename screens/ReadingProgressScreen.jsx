import React from 'react';
import { View, Text, ProgressBarAndroid, StyleSheet } from 'react-native';

export default function ReadingProgressScreen({ route }) {
  const { progress, total } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progreso de lectura</Text>
      <ProgressBarAndroid styleAttr="Horizontal" progress={progress / total} indeterminate={false} />
      <Text style={styles.percent}>{((progress / total) * 100).toFixed(0)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  percent: { marginTop: 10, fontSize: 16 }
});