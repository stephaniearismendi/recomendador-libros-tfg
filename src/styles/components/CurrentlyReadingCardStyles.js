import { StyleSheet } from 'react-native';
import { COLORS, baseStyles } from '../baseStyles';

export const currentlyReadingStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    ...baseStyles.shadowSmall,
  },
  cardEmpty: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  cover: {
    width: 72,
    height: 108,
    borderRadius: 10,
    backgroundColor: COLORS.BORDER,
  },
  meta: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT,
    lineHeight: 20,
  },
  author: {
    fontSize: 13,
    color: COLORS.SUBT,
    marginTop: 6,
    lineHeight: 16,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 24,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.ACCENT,
    width: 38,
    textAlign: 'right',
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.SUBT,
    lineHeight: 18,
  },
});
