import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const readingChallengeStyles = StyleSheet.create({
  container: {
    borderRadius: 0,
    padding: 0,
    marginBottom: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  title: {
    ...TYPOGRAPHY.subheading,
    fontSize: 18,
    color: COLORS.INFO,
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    backgroundColor: COLORS.BORDER,
    height: 14,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progress: {
    height: 14,
    backgroundColor: COLORS.WARNING,
    borderRadius: 20,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Poppins-Medium',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginTop: 2,
  },
});
