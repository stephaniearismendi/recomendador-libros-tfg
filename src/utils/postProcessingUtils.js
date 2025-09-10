import { getBookCoverUri } from './imageUtils';
import { getUserAvatar, getUserDisplayName } from './userUtils';

export const processBackendPost = (post) => {
  if (!post) return null;
  
  const postUserId = post.user?.id;
  const postUserName = post.user?.name || 'Usuario desconocido';
  const postUserAvatar = post.user?.avatar || getUserAvatar(null);
  
  if (!postUserId || postUserId === 'unknown' || postUserId === 'undefined' || postUserId === 'null') {
    return null;
  }
  
  let bookInfo = null;
  if (post.book) {
    bookInfo = {
      id: post.book.id,
      title: post.book.title || 'Sin título',
      author: post.book.author || 'Autor desconocido',
      cover: getBookCoverUri(post.book)
    };
  }
  
  return {
    id: post.id,
    user: { 
      id: String(postUserId), 
      name: postUserName, 
      avatar: postUserAvatar 
    },
    text: post.text,
    book: bookInfo,
    likes: post.likes || 0,
    comments: (post.comments || []).map((c) => ({
      id: c.id,
      user: { 
        id: String(c.user.id), 
        name: c.user.name, 
        avatar: c.user.avatar 
      },
      text: c.text,
      time: c.time,
    })),
    time: post.time,
    _source: 'backend',
  };
};

export const processFeedPosts = (feedData, followedUserIds, currentUserId, maxPosts = 10) => {
  if (!feedData || !Array.isArray(feedData)) return [];
  
  const allBackendPosts = feedData
    .map(processBackendPost)
    .filter(Boolean);
  
  const allFollowedUsers = [...followedUserIds, String(currentUserId)];
  const relevantPosts = allBackendPosts.filter(post => 
    allFollowedUsers.includes(post.user.id)
  );
  
  return getRandomPosts(relevantPosts, maxPosts);
};

export const getRandomPosts = (posts, maxCount) => {
  if (posts.length <= maxCount) return posts;
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, maxCount);
};

export const createNewPost = (postData, userId, user) => {
  return {
    id: postData.id,
    user: {
      id: String(userId),
      name: getUserDisplayName(user),
      avatar: getUserAvatar(user),
    },
    text: postData.text,
    book: postData.book,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    _source: 'backend',
  };
};

export const updatePostLikes = (posts, postId, newLikes) => {
  return posts.map((p) => 
    p.id === postId ? { ...p, likes: newLikes } : p
  );
};

export const addPostComment = (posts, postId, newComment) => {
  return posts.map((p) => 
    p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
  );
};

export const removePostComment = (posts, postId, commentId) => {
  return posts.map((p) => 
    p.id === postId ? { 
      ...p, 
      comments: (p.comments || []).filter(c => c.id !== commentId) 
    } : p
  );
};

export const filterPostsByUser = (posts, userId) => {
  return posts.filter(post => post.user.id !== String(userId));
};
