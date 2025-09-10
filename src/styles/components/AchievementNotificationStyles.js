import { StyleSheet } from 'react-native';
import { COLORS } from '../baseStyles';

export const achievementNotificationStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  container: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  icon: {
    fontSize: 32,
  },
  checkmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.CARD,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.SUBT,
    marginBottom: 8,
    lineHeight: 18,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  progressContainer: {
    height: 3,
    backgroundColor: COLORS.BG,
  },
  progressBar: {
    height: '100%',
    width: '100%',
  },
});
