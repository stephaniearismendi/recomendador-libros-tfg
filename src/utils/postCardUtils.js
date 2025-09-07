import { getUserAvatar, getUserDisplayName } from './userUtils';
import { getBookCoverUri } from './imageUtils';

export const formatPostUser = (user) => {
  if (!user) return { name: 'Usuario', avatar: getUserAvatar(null) };
  
  return {
    name: getUserDisplayName(user),
    avatar: getUserAvatar(user)
  };
};

export const formatPostBook = (book) => {
  if (!book) return null;
  
  return {
    id: book.id,
    title: book.title,
    author: book.author || 'Autor desconocido',
    cover: getBookCoverUri(book)
  };
};

export const isPostOwner = (postUserId, currentUserId) => {
  if (!postUserId || !currentUserId) return false;
  return String(postUserId) === String(currentUserId);
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'hoy';
  
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'hace un momento';
  if (diffInHours < 24) return `hace ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `hace ${diffInDays}d`;
  
  return 'hace tiempo';
};

export const getPostStats = (post) => ({
  likes: post?.likes || 0,
  comments: (post?.comments || []).length
});
