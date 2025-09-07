import { StyleSheet, Platform } from 'react-native';
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

export const getTabBarStyle = (insets) => {
  if (Platform.OS === 'android') {
    return {
      height: 50 + Math.max(insets.bottom, 15),
      paddingBottom: Math.max(insets.bottom, 15),
      paddingTop: 0,
      marginTop: 0,
      marginBottom: 0,
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    };
  }
  return {
    height: 35 + insets.bottom,
    paddingBottom: insets.bottom,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
    borderTopWidth: 0,
    shadowOpacity: 0,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  };
};
