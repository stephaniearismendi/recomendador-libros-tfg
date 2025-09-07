import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useCustomSafeArea = () => {
  const insets = useSafeAreaInsets();
  
  const getContainerStyle = () => {
    if (Platform.OS === 'android') {
      return {
        paddingTop: Math.max(insets.top, 40),
        paddingBottom: Math.max(insets.bottom, 15)
      };
    }
    return {
      paddingTop: insets.top,
      paddingBottom: insets.bottom
    };
  };

  const getScrollStyle = () => {
    if (Platform.OS === 'android') {
      return {
        paddingTop: 16,
        paddingBottom: Math.max(insets.bottom, 20)
      };
    }
    return {
      paddingBottom: Math.max(insets.bottom, 15)
    };
  };

  return {
    insets,
    getContainerStyle,
    getScrollStyle
  };
};
