import { getStories, getUserStories, createStory } from '../api/api';
import { getBookCoverUri } from './imageUtils';

const FALLBACK_COVER = 'https://covers.openlibrary.org/b/id/240727-M.jpg';
const STORIES_CACHE_KEY = 'social:stories';
const STORIES_CACHE_TTL = 10 * 60 * 1000;

export const processStoriesData = (storiesData, currentUserId, currentUser) => {
  const backendStories = [];
  
  if (!storiesData || !Array.isArray(storiesData)) {
    backendStories.push({
      id: currentUserId,
      name: 'Tú',
      avatar: currentUser?.avatar || `https://i.pravatar.cc/150?u=${currentUserId}`,
      slides: [],
      isCurrentUser: true
    });
    return backendStories;
  }
  
  const currentUserStory = {
    id: currentUserId,
    name: 'Tú',
    avatar: currentUser?.avatar || `https://i.pravatar.cc/150?u=${currentUserId}`,
    slides: [],
    isCurrentUser: true
  };
  
  backendStories.push(currentUserStory);
  
  storiesData.forEach((userGroup) => {
    const user = userGroup.user;
    
    if (String(user.id) === String(currentUserId)) {
      return;
    }
    
    const stories = userGroup.stories || [];
    const slides = stories.map((story) => ({
      id: story.id,
      uri: getBookCoverUri(story.book) || story.bookCover || story.imageUrl || FALLBACK_COVER,
      caption: story.content || story.book?.title || story.bookTitle || 'Mi historia'
    }));
    
    if (slides.length > 0) {
      backendStories.push({
        id: user.id,
        name: user.name || 'Usuario',
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
        slides: slides,
        isCurrentUser: false
      });
    }
  });
  
  return backendStories;
};

export const processCurrentUserStories = (currentUserStories) => {
  if (!currentUserStories || !Array.isArray(currentUserStories)) return [];
  
  return currentUserStories.map((story) => ({
    id: story.id,
    uri: getBookCoverUri(story.book) || story.bookCover || story.imageUrl || FALLBACK_COVER,
    caption: story.content || story.book?.title || story.bookTitle || 'Mi historia'
  }));
};

export const loadStories = async (token, userId, user) => {
  try {
    const [storiesRes, currentUserStoriesRes] = await Promise.all([
      getStories(token).catch(() => ({ data: [] })),
      getUserStories(userId).catch(() => ({ data: { stories: [] } }))
    ]);
    
    const currentUserStories = processCurrentUserStories(currentUserStoriesRes.data?.stories);
    const allStories = processStoriesData(storiesRes.data, userId, user);
    
    if (allStories.length > 0 && allStories[0].isCurrentUser) {
      allStories[0].slides = currentUserStories;
    }
    
    return allStories;
  } catch (error) {
    return [{
      id: userId,
      name: 'Tú',
      avatar: user?.avatar || `https://i.pravatar.cc/150?u=${userId}`,
      slides: [],
      isCurrentUser: true
    }];
  }
};

export const publishStory = async (storyData, token) => {
  try {
    const response = await createStory(storyData, token);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const buildStorySlides = (popularBooks, count = 2) => {
  const pool = popularBooks.length ? popularBooks : [];
  const slides = [];
  
  for (let i = 0; i < count; i++) {
    const book = pool[Math.floor(Math.random() * Math.max(1, pool.length))];
    if (!book) break;
    
    slides.push({
      id: `${book.id || book.title}-${i}`,
      uri: getBookCoverUri(book),
      caption: `${book.title} · ${book.author || ''}`.trim(),
    });
  }
  
  return slides.length ? slides : [{ id: 'fb', uri: FALLBACK_COVER, caption: 'Historia' }];
};
