import { StyleSheet } from 'react-native';
import { COLORS, baseStyles } from '../baseStyles';

export const genreFilterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipPrimary: {
    backgroundColor: COLORS.ACCENT,
  },
  chipSecondary: {
    backgroundColor: COLORS.BORDER,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextPrimary: {
    color: '#FFFFFF',
  },
  chipTextSecondary: {
    color: COLORS.TEXT,
  },
});
