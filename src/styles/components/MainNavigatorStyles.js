import { StyleSheet } from 'react-native';
import { COLORS } from '../baseStyles';

export const mainNavigatorStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG,
  },
  loadingIndicator: {
    color: COLORS.ACCENT,
  },
});
