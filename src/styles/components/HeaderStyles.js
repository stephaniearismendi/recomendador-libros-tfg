import { StyleSheet } from 'react-native';
import { COLORS, baseStyles } from '../baseStyles';

export const headerStyles = StyleSheet.create({
  header: {
    ...baseStyles.header,
  },
  headerContent: {
    ...baseStyles.headerContent,
  },
  greetingContainer: {
    ...baseStyles.headerInfo,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.SUBT,
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    ...baseStyles.headerTitle,
    fontSize: 20,
    marginBottom: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BORDER,
  },
});
