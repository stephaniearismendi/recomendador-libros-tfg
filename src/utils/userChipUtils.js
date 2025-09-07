export const canUserFollow = (user) => {
  return user?.canFollow !== false;
};

export const isDemoUser = (user) => {
  return user?.isDemo || user?.id?.startsWith('demo_');
};

export const getFollowButtonLabel = (following) => {
  return following ? '✓' : 'Seguir';
};

export const getFollowButtonStyle = (following, isDemo) => {
  if (isDemo) return 'demo';
  return following ? 'outline' : 'primary';
};

export const validateUserData = (user) => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name || user.username || 'Usuario',
    bio: user.bio || null,
    avatar: user.avatar || null,
    canFollow: canUserFollow(user),
    isDemo: isDemoUser(user)
  };
};

export const getSafeBio = (bio) => {
  return bio && String(bio).trim().length > 0 ? String(bio).trim() : null;
};
