import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFollowing, getFollowStatus, followUser, unfollowUser, getSuggestions } from '../api/api';

const FOLLOW_CACHE_KEY = (uid) => `social:following:${uid}`;
const FOLLOWING_CACHE_KEY = 'social:following';
const FOLLOWING_CACHE_TTL = 30 * 60 * 1000;

export const getCached = async (key, ttl) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const { ts, value } = JSON.parse(raw);
    if (!ts || Date.now() - ts > ttl) return null;
    return value;
  } catch {
    return null;
  }
};

export const setCached = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }));
  } catch {}
};

export const saveFollowingToCache = async (following) => {
  try {
    await setCached(FOLLOWING_CACHE_KEY, following);
  } catch {}
};

export const loadFollowingFromCache = async () => {
  try {
    return await getCached(FOLLOWING_CACHE_KEY, FOLLOWING_CACHE_TTL);
  } catch {
    return null;
  }
};

export const hasValidToken = (token) => {
  return token && typeof token === 'string' && token.length > 0;
};

export const getRandomPosts = (posts, maxCount) => {
  if (posts.length <= maxCount) return posts;
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, maxCount);
};

export const loadFollowingState = async (userId, token) => {
  if (!userId || !token) return {};
  
  try {
    const raw = await AsyncStorage.getItem(FOLLOW_CACHE_KEY(userId));
    const cachedFollowing = raw ? JSON.parse(raw) : {};
    
    const cacheAge = raw ? Date.now() - JSON.parse(raw).ts : Infinity;
    const isCacheStale = cacheAge > FOLLOWING_CACHE_TTL;
    
    if (Object.keys(cachedFollowing).length === 0 || isCacheStale) {
      try {
        let realFollowing = {};
        try {
          const followingRes = await getFollowing(userId, token);
          const followingUsers = followingRes.data || [];
          
          followingUsers.forEach(user => {
            realFollowing[String(user.id)] = true;
          });
        } catch (backendError) {
          const suggestions = await getSuggestions(token);
          
          for (const user of suggestions.data || []) {
            try {
              const status = await getFollowStatus(user.id, token);
              realFollowing[user.id] = status.data.following;
            } catch (error) {
              realFollowing[user.id] = cachedFollowing[user.id] || false;
            }
          }
        }
        
        await AsyncStorage.setItem(FOLLOW_CACHE_KEY(userId), JSON.stringify({
          ...realFollowing,
          ts: Date.now()
        }));
        
        return realFollowing;
      } catch (error) {
        return cachedFollowing;
      }
    }
    
    return cachedFollowing;
  } catch (error) {
    return {};
  }
};

export const toggleFollowUser = async (targetUserId, currentUserId, token, currentFollowing) => {
  if (!hasValidToken(token)) return { success: false, error: 'No token' };
  
  if (String(targetUserId) === String(currentUserId)) {
    return { success: false, error: 'Cannot follow self' };
  }
  
  const cleanUid = parseInt(String(targetUserId).trim(), 10);
  if (!cleanUid || isNaN(cleanUid)) {
    return { success: false, error: 'Invalid user ID' };
  }
  
  const isCurrentlyFollowing = currentFollowing[targetUserId] || currentFollowing[cleanUid] || currentFollowing[String(cleanUid)];
  
  try {
    let response;
    if (isCurrentlyFollowing) {
      response = await unfollowUser(cleanUid, token);
    } else {
      response = await followUser(cleanUid, token);
    }
    
    const newFollowingState = response.data.following;
    const finalState = { ...currentFollowing, [cleanUid]: newFollowingState };
    
    await AsyncStorage.setItem(FOLLOW_CACHE_KEY(currentUserId), JSON.stringify(finalState));
    
    return { success: true, following: finalState, newState: newFollowingState };
  } catch (error) {
    const errorData = error.response?.data;
    const status = error.response?.status;
    
    if (status === 409) {
      return { success: false, error: 'Conflict', conflict: true };
    } else if (errorData?.error === 'CANNOT_FOLLOW_SELF') {
      return { success: false, error: 'Cannot follow self' };
    } else if (errorData?.error === 'INVALID_TARGET') {
      return { success: false, error: 'Invalid user' };
    } else if (status === 401) {
      return { success: false, error: 'Unauthorized' };
    } else {
      return { success: false, error: `Unknown error (${status || 'Unknown'})` };
    }
  }
};
