import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SocialScreen from '../screens/SocialScreen';
import { getTabIconConfig } from '../utils/navigationUtils';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const iconConfig = getTabIconConfig();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 35 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 0,
        },
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
