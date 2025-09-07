import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const readingProgressStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontSize: 24,
    marginBottom: 32,
    textAlign: 'center',
    color: COLORS.TEXT,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.ACCENT,
    borderRadius: 4,
  },
  percentageText: {
    ...TYPOGRAPHY.heading,
    fontSize: 32,
    color: COLORS.ACCENT,
    marginBottom: 8,
  },
  progressText: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT,
    marginBottom: 16,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUBT,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    ...TYPOGRAPHY.body,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});
