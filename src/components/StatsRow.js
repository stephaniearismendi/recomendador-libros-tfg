import React from 'react';
import { View, Text } from 'react-native';
import { statsRowStyles } from '../styles/components';
import { getStatItems } from '../utils/statsUtils';

export default function StatsRow({ stats = {} }) {
  const statItems = getStatItems(stats);

  return (
    <View style={statsRowStyles.card}>
      {statItems.map((item, index) => (
        <React.Fragment key={item.label}>
          <View style={statsRowStyles.stat}>
            <Text style={statsRowStyles.value}>{item.value}</Text>
            <Text style={statsRowStyles.label}>{item.label}</Text>
          </View>
          {index < statItems.length - 1 && <View style={statsRowStyles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
}
