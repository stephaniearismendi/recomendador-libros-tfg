const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=default';

export const getUserAvatar = (user) => {
  if (!user) return DEFAULT_AVATAR;
  return user.avatar || DEFAULT_AVATAR;
};

export const getUserDisplayName = (user) => {
  if (!user) return 'Usuario';
  return user.name || user.username || 'Usuario';
};

export const getAvatarWithCache = (user) => {
  const avatar = getUserAvatar(user);
  return `${avatar}?v=${Math.random()}&t=${Date.now()}`;
};
