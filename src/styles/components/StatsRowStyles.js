import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const statsRowStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: COLORS.SHADOW,
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
    ...TYPOGRAPHY.heading,
    fontSize: 22,
    color: COLORS.INFO,
    marginBottom: 2,
  },
  label: {
    ...TYPOGRAPHY.small,
    color: COLORS.SUBT,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.BORDER,
    opacity: 0.8,
    marginHorizontal: 6,
    borderRadius: 1,
  },
});
