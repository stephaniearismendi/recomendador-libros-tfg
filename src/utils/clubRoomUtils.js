import { validateToken } from './authContextUtils';
import { getUserAvatar, getUserDisplayName } from './userUtils';

export const createOptimisticMessage = (text, user) => ({
  id: `tmp_${Date.now()}`,
  userName: getUserDisplayName(user),
  userAvatar: getUserAvatar(user),
  text: text.trim(),
  createdAt: new Date().toISOString(),
});

export const updateMessageWithResponse = (messages, optimisticId, response) => {
  if (response?.data?.id) {
    return messages.map((m) => (m.id === optimisticId ? response.data : m));
  } else if (response?.data) {
    return messages.map((m) => (m.id === optimisticId ? response.data : m));
  } else {
    return messages.map((m) => 
      m.id === optimisticId 
        ? { ...m, id: `sent_${Date.now()}`, status: 'sent' }
        : m
    );
  }
};

export const removeOptimisticMessage = (messages, optimisticId) => {
  return messages.filter((m) => m.id !== optimisticId);
};

export const getFirstChapter = (chapters) => {
  if (!chapters.length) return 1;
  return Math.min(...chapters.map((x) => x.chapter));
};

export const sortChapters = (chapters) => {
  return [...chapters].sort((a, b) => a.chapter - b.chapter);
};

export const getChapterDisplayText = (chapter) => {
  if (!chapter) return 'Capítulos';
  return `Cap. ${chapter.chapter}${chapter.title ? ` · ${chapter.title}` : ''}`;
};

export const validateTokenAndHandleExpiry = async (token, logout, navigation) => {
  if (!validateToken(token)) {
    await logout();
    navigation.navigate('Login');
    return false;
  }
  return true;
};
