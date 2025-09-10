export const getScreenOptions = (title = null) => {
  const baseOptions = { headerShown: false };

  if (title) {
    return {
      ...baseOptions,
      headerShown: true,
      title,
    };
  }

  return baseOptions;
};

export const getAuthenticatedScreens = () => [
  { name: 'Tabs', component: 'TabNavigator' },
  { name: 'BookDetail', component: 'BookDetailScreen' },
  { name: 'ClubRoom', component: 'ClubRoomScreen', title: 'Club de lectura' },
  { name: 'Achievements', component: 'AchievementsScreen' },
];

export const getUnauthenticatedScreens = () => [
  { name: 'Login', component: 'LoginScreen' },
  { name: 'Register', component: 'RegisterScreen' },
];

export const validateAuthState = (token, loading) => {
  return {
    isAuthenticated: !!token,
    isLoading: !!loading,
    shouldShowLoading: loading === true,
  };
};

export const getTabIconConfig = () => ({
  Inicio: 'home',
  Biblioteca: 'library',
  Social: 'people',
  Perfil: 'person-circle',
});

export const getTabScreens = () => [
  { name: 'Inicio', component: 'HomeScreen' },
  { name: 'Biblioteca', component: 'LibraryScreen' },
  { name: 'Social', component: 'SocialScreen' },
  { name: 'Perfil', component: 'ProfileScreen' },
];
