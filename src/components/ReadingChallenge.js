import React from 'react';
import { View, Text } from 'react-native';
import { readingChallengeStyles } from '../styles/components';
import { validateProgress } from '../utils/readingUtils';

export default function ReadingChallenge({ title, current = 0, total = 1 }) {
  const safeCurrent = Math.max(0, Number(current) || 0);
  const safeTotal = Math.max(1, Number(total) || 1);
  const progress = validateProgress((safeCurrent / safeTotal) * 100);

  return (
    <View style={readingChallengeStyles.container}>
      <Text style={readingChallengeStyles.title}>{title || 'Desafío de lectura'}</Text>
      <View style={readingChallengeStyles.progressBar}>
        <View style={[readingChallengeStyles.progress, { width: `${progress}%` }]} />
      </View>
      <Text style={readingChallengeStyles.progressText}>
        {`${safeCurrent} / ${safeTotal} libros leídos`}
      </Text>
    </View>
  );
}
