import { StyleSheet } from 'react-native';
import { COLORS } from '../baseStyles';

export const achievementBadgeStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },

  container_small: {
    padding: 8,
    borderRadius: 8,
  },

  container_medium: {
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },

  container_large: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },

  unlocked: {
    backgroundColor: COLORS.CARD,
    borderColor: COLORS.ACCENT,
  },

  locked: {
    backgroundColor: COLORS.BG,
    borderColor: COLORS.BORDER,
    opacity: 0.7,
  },

  iconContainer: {
    position: 'relative',
    marginRight: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F1FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
  },

  icon: {
    fontSize: 24,
    textAlign: 'center',
    color: COLORS.TEXT,
  },

  icon_small: {
    fontSize: 20,
  },

  icon_medium: {
    fontSize: 24,
  },

  icon_large: {
    fontSize: 32,
  },

  iconContainer_small: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  iconContainer_medium: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  iconContainer_large: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  checkmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.CARD,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    color: COLORS.TEXT,
  },

  title_small: {
    fontSize: 12,
  },

  title_medium: {
    fontSize: 14,
  },

  title_large: {
    fontSize: 18,
    fontWeight: '700',
  },

  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
    color: COLORS.SUBT,
  },

  description_small: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 6,
  },

  description_medium: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },

  description_large: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 10,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.BORDER,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  progressText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.SUBT,
    minWidth: 30,
    textAlign: 'right',
  },

  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  points: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: COLORS.TEXT,
  },

  points_small: {
    fontSize: 10,
  },

  points_medium: {
    fontSize: 12,
  },

  points_large: {
    fontSize: 14,
  },

  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
});
