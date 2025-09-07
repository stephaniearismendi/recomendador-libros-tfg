import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const selectorStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Poppins-Medium',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    backgroundColor: COLORS.BORDER,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: COLORS.ACCENT,
  },
  optionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.TEXT,
  },
  optionTextSelected: {
    color: COLORS.CARD,
  },
});
