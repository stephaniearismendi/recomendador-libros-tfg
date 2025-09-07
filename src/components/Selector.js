import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { selectorStyles } from '../styles/components';
import { isOptionSelected, handleOptionSelect, validateOptions, getSafeLabel } from '../utils/selectorUtils';

export default function Selector({ label, options = [], selected, onSelect }) {
  const safeOptions = validateOptions(options);
  const safeLabel = getSafeLabel(label);

  const handlePress = useCallback((option) => {
    if (onSelect) {
      handleOptionSelect(option, selected, onSelect);
    }
  }, [selected, onSelect]);

  if (safeOptions.length === 0) {
    return null;
  }

  return (
    <View style={selectorStyles.wrapper}>
      <Text style={selectorStyles.label}>{safeLabel}</Text>
      <View style={selectorStyles.optionContainer}>
        {safeOptions.map((option) => {
          const isSelected = isOptionSelected(selected, option);
          return (
            <TouchableOpacity
              key={String(option)}
              style={[selectorStyles.option, isSelected && selectorStyles.optionSelected]}
              onPress={() => handlePress(option)}
              activeOpacity={0.7}
            >
              <Text style={[selectorStyles.optionText, isSelected && selectorStyles.optionTextSelected]}>
                {String(option)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
