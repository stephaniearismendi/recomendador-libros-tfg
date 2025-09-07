import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SocialScreen from '../screens/SocialScreen';
import { getTabIconConfig } from '../utils/navigationUtils';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const iconConfig = getTabIconConfig();
  const insets = useSafeAreaInsets();

  const getTabBarStyle = () => {
    if (Platform.OS === 'android') {
      return {
        height: 50 + Math.max(insets.bottom, 15),
        paddingBottom: Math.max(insets.bottom, 15),
        paddingTop: 5,
      };
    }
    return {
      height: 35 + insets.bottom,
      paddingBottom: insets.bottom,
      paddingTop: 0,
    };
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: getTabBarStyle(),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconConfig[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Biblioteca" component={LibraryScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
