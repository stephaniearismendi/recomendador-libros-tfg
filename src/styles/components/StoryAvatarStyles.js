import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../baseStyles';

export const storyAvatarStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: 76,
  },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    padding: 2,
    marginBottom: 6,
  },
  active: {
    borderColor: COLORS.ACCENT,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  name: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    maxWidth: 70,
  },
});
