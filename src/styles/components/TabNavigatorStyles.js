import { StyleSheet } from 'react-native';
import { COLORS } from '../baseStyles';

export const tabNavigatorStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.CARD,
    borderTopColor: COLORS.BORDER,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  tabBarActiveLabel: {
    color: COLORS.ACCENT,
  },
  tabBarInactiveLabel: {
    color: COLORS.SUBT,
  },
});
