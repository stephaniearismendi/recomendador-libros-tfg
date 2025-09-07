import React, { useContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { mainNavigatorStyles } from '../styles/components';
import { getScreenOptions, getAuthenticatedScreens, getUnauthenticatedScreens, validateAuthState } from '../utils/navigationUtils';
import TabNavigator from './TabNavigator';
import BookDetailScreen from '../screens/BookDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ClubRoomScreen from '../screens/ClubRoomScreen';

const Stack = createStackNavigator();

const screenComponents = {
  TabNavigator,
  BookDetailScreen,
  LoginScreen,
  RegisterScreen,
  ClubRoomScreen
};

export default function MainNavigator() {
  const { token, loading } = useContext(AuthContext);
  const authState = validateAuthState(token, loading);

  const screens = useMemo(() => {
    return authState.isAuthenticated 
      ? getAuthenticatedScreens() 
      : getUnauthenticatedScreens();
  }, [authState.isAuthenticated]);

  if (authState.shouldShowLoading) {
    return (
      <View style={mainNavigatorStyles.loadingContainer}>
        <ActivityIndicator size="large" color={mainNavigatorStyles.loadingIndicator.color} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={getScreenOptions()}>
      {screens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screenComponents[screen.component]}
          options={getScreenOptions(screen.title)}
        />
      ))}
    </Stack.Navigator>
  );
}
