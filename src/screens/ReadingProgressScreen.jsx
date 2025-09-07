import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { readingProgressStyles } from '../styles/components';
import {
  calculateProgressPercentage,
  formatProgressPercentage,
  validateProgressData,
  getProgressColor,
  getProgressStatus,
  formatProgressText,
} from '../utils/readingProgressUtils';

export default function ReadingProgressScreen({ route }) {
  const { progress, total } = route.params || {};
  
  const validation = validateProgressData(progress, total);
  
  if (!validation.isValid) {
    return (
      <View style={readingProgressStyles.errorContainer}>
        <Text style={readingProgressStyles.errorText}>
          {validation.error}
        </Text>
        <TouchableOpacity style={readingProgressStyles.retryButton}>
          <Text style={readingProgressStyles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const percentage = calculateProgressPercentage(progress, total);
  const progressColor = getProgressColor(percentage);
  const status = getProgressStatus(percentage);
  
  return (
    <View style={readingProgressStyles.container}>
      <Text style={readingProgressStyles.title}>Progreso de lectura</Text>
      
      <View style={readingProgressStyles.progressContainer}>
        <View style={readingProgressStyles.progressBar}>
          <View 
            style={[
              readingProgressStyles.progressFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: progressColor 
              }
            ]} 
          />
        </View>
        
        <Text style={readingProgressStyles.percentageText}>
          {formatProgressPercentage(progress, total)}
        </Text>
        
        <Text style={readingProgressStyles.progressText}>
          {formatProgressText(progress, total)}
        </Text>
        
        <Text style={readingProgressStyles.statusText}>
          {status}
        </Text>
      </View>
    </View>
  );
}