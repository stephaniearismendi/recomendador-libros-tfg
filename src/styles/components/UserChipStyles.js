import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const userChipStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.BORDER,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Poppins-Bold',
    color: COLORS.TEXT,
  },
  bio: {
    ...TYPOGRAPHY.small,
    color: COLORS.SUBT,
    marginTop: 2,
  },
  button: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    ...TYPOGRAPHY.small,
    color: COLORS.CARD,
    fontFamily: 'Poppins-SemiBold',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  buttonOutlineText: {
    color: COLORS.ACCENT,
  },
  buttonDemo: {
    backgroundColor: COLORS.WARNING,
  },
  buttonDemoText: {
    color: COLORS.CARD,
  },
  buttonDisabled: {
    backgroundColor: COLORS.BORDER,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonDisabledText: {
    ...TYPOGRAPHY.small,
    color: COLORS.SUBT,
    fontFamily: 'Poppins-SemiBold',
  },
});
