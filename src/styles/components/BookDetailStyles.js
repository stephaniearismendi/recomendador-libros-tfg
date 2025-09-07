import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const bookDetailStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    padding: 4,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: {
    width: 160,
    height: 230,
    borderRadius: 12,
    marginTop: 60,
    marginBottom: 18,
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUBT,
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.ACCENT,
    marginLeft: 6,
  },
  description: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 40,
  },
  favButtonText: {
    ...TYPOGRAPHY.body,
    color: '#e63946',
    marginLeft: 8,
  },
});
