import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import StoryAvatar from '../components/StoryAvatar';
import StoryViewer from '../components/StoryViewer';
import PostCard from '../components/PostCard';
import UserChip from '../components/UserChip';
import ClubCard from '../components/ClubCard';
import ComposeStoryModal from '../components/ComposeStoryModal';
import CreateClubModal from '../components/CreateClubModal';
import CreatePostModal from '../components/CreatePostModal';
import CommentSheet from '../components/CommentSheet';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/socialStyles';
import {
  getFavorites,
  getPopularBooks,
  getFeed,
  likePost,
  commentPost,
  getClubs,
  toggleJoinClub,
  createClub,
  getSuggestions,
  getSuggestionsNoAuth,
  getSuggestionsTemp,
  getAllUsers,
  toggleFollow,
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowing,
  getFollowers,
  createPost,
  createStory,
  getStories,
  cleanExpiredStories,
  seedStories,
} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '../../config';

const FALLBACK_COVER = 'https://covers.openlibrary.org/b/id/240727-M.jpg';
const CLUBS_CACHE_TTL = 6 * 60 * 60 * 1000;
const CLUBS_CACHE_KEY = 'social:clubs';
const FOLLOW_CACHE_KEY = (uid) => `social:following:${uid}`;
const FOLLOWING_CACHE_KEY = 'social:following';
const FOLLOWING_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Smart feed configuration
const MAX_FEED_POSTS = 15; // Maximum number of posts to show in feed
const FEED_CACHE_KEY = 'social:smart_feed';
const FEED_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCached(key, ttl) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const { ts, value } = JSON.parse(raw);
    if (!ts || Date.now() - ts > ttl) return null;
    return value;
  } catch {
    return null;
  }
}
async function setCached(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }));
  } catch {}
}




// Follow system functions
const saveFollowingToCache = async (following) => {
  try {
    await setCached(FOLLOWING_CACHE_KEY, following);
  } catch (error) {
    console.error('Error saving following to cache:', error);
  }
};

const loadFollowingFromCache = async () => {
  try {
    return await getCached(FOLLOWING_CACHE_KEY, FOLLOWING_CACHE_TTL);
  } catch (error) {
    console.error('Error loading following from cache:', error);
    return null;
  }
};

// Smart feed functions
const getRandomPosts = (posts, maxCount) => {
  if (posts.length <= maxCount) return posts;
  
  // Shuffle array and take first maxCount elements
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, maxCount);
};

const saveSmartFeedToCache = async (feed) => {
  try {
    await setCached(FEED_CACHE_KEY, feed);
  } catch (error) {
    console.error('Error saving smart feed to cache:', error);
  }
};

const loadSmartFeedFromCache = async () => {
  try {
    return await getCached(FEED_CACHE_KEY, FEED_CACHE_TTL);
  } catch (error) {
    console.error('Error loading smart feed from cache:', error);
    return null;
  }
};

// Simple token check - just verify it exists
const hasValidToken = (token) => {
  return token && typeof token === 'string' && token.length > 0;
};

export default function SocialScreen() {
  const navigation = useNavigation();
  const { token, logout, user } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);

  // Refresh user data when component mounts
  useEffect(() => {
    if (token && !user) {
      // The AuthContext should handle this automatically
    }
  }, [token, user]);

  const [favorites, setFavorites] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [stories, setStories] = useState([]);
  
  const [popular, setPopular] = useState([]);
  const [allBackendUsers, setAllBackendUsers] = useState([]);

  const [composeStoryVisible, setComposeStoryVisible] = useState(false);
  const [createClubVisible, setCreateClubVisible] = useState(false);
  const [commentsFor, setCommentsFor] = useState(null);
  const [viewer, setViewer] = useState({ open: false, index: 0 });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [clubsLoading, setClubsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [posting, setPosting] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  const me = useMemo(
    () => ({
      id: userId || 0,
      name: 'Tú',
      avatar: `https://i.pravatar.cc/150?u=${userId || 'me'}`,
    }),
    [userId],
  );

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    } else if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded?.userId || null);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, [token, user]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError(null);
        const cachedClubs = await getCached(CLUBS_CACHE_KEY, CLUBS_CACHE_TTL);
        if (cachedClubs) setClubs(cachedClubs);

        const [clubsRes, popRes] = await Promise.all([
        getClubs().catch(() => ({ data: [] })),
        getPopularBooks().catch(() => ({ data: [] })),
        ]);
        
        const liveClubs = clubsRes.data || [];
        setClubs(liveClubs);
        setCached(CLUBS_CACHE_KEY, liveClubs);
        const popularData = popRes.data || [];
        setPopular(popularData);
      } catch (error) {
        setError('Error al cargar los datos');
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!userId || !token) return;
    
    let isMounted = true;
    
    (async () => {
      try {
        // Load from cache first for immediate UI update
        const raw = await AsyncStorage.getItem(FOLLOW_CACHE_KEY(userId));
        const cachedFollowing = raw ? JSON.parse(raw) : {};
        
        // Only update state if component is still mounted
        if (isMounted) {
          setFollowing(cachedFollowing);
        }
        
        // Only sync with backend if we don't have cached data or cache is very old
        const cacheAge = raw ? Date.now() - JSON.parse(raw).ts : Infinity;
        const isCacheStale = cacheAge > FOLLOWING_CACHE_TTL;
        
        if (Object.keys(cachedFollowing).length === 0 || isCacheStale) {
          try {
            // Try to get following users from the backend endpoint first
            let realFollowing = {};
            try {
              const followingRes = await getFollowing(userId, token);
              const followingUsers = followingRes.data || [];
              
              // Create following state from backend data
              followingUsers.forEach(user => {
                realFollowing[String(user.id)] = true;
              });
            } catch (backendError) {
              // Fallback: use suggestions and check follow status
              const suggestions = await getSuggestions(token);
              
              // Check follow status for each suggested user
              for (const user of suggestions.data || []) {
                try {
                  const status = await getFollowStatus(user.id, token);
                  realFollowing[user.id] = status.data.following;
                } catch (error) {
                  // Keep cached value if backend check fails
                  realFollowing[user.id] = cachedFollowing[user.id] || false;
                }
              }
            }
            
            // Only update state if component is still mounted
            if (isMounted) {
              setFollowing(realFollowing);
            }
            
            // Save with timestamp for cache age tracking
            await AsyncStorage.setItem(FOLLOW_CACHE_KEY(userId), JSON.stringify({
              ...realFollowing,
              ts: Date.now()
            }));
          } catch (error) {
            console.error('Error syncing follow status with backend:', error);
            // Keep using cached data if sync fails
            if (isMounted && Object.keys(cachedFollowing).length > 0) {
              setFollowing(cachedFollowing);
            }
          }
        }
      } catch (error) {
        console.error('Error syncing follow status:', error);
        // Fallback to cached data only if component is still mounted
        if (isMounted) {
          const raw = await AsyncStorage.getItem(FOLLOW_CACHE_KEY(userId));
          const fallbackData = raw ? JSON.parse(raw) : {};
          setFollowing(fallbackData);
        }
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) return;
    (async () => {
      try {
        const favs = await getFavorites(userId, token);
        setFavorites(favs?.data || []);
      } catch {
        setFavorites([]);
      }
    })();
  }, [userId, token]);

  const coverUriFromBook = useCallback((b) => {
    const s = typeof b?.image === 'string' ? b.image : null;
    const o = typeof b?.image === 'object' && b?.image?.uri ? b.image.uri : null;
    const direct = s || o || b?.cover || b?.coverUrl || b?.imageUrl;
    if (direct) return direct;
    if (b?.cover_i) return `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`;
    if (Array.isArray(b?.isbn) && b.isbn.length > 0)
      return `https://covers.openlibrary.org/b/isbn/${b.isbn[0]}-M.jpg`;
    if (b?.title)
      return `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`;
    return FALLBACK_COVER;
  }, []);

  const buildStorySlides = useCallback(
    (n = 2) => {
      const pool = popular.length ? popular : [];
      const slides = [];
      for (let i = 0; i < n; i++) {
        const b = pool[Math.floor(Math.random() * Math.max(1, pool.length))];
        if (!b) break;
        slides.push({
          id: `${b.id || b.title}-${i}`,
          uri: coverUriFromBook(b),
          caption: `${b.title} · ${b.author || ''}`.trim(),
        });
      }
      return slides.length ? slides : [{ id: 'fb', uri: FALLBACK_COVER, caption: 'Historia' }];
    },
    [popular, coverUriFromBook],
  );

  const loadRemote = useCallback(async () => {
    if (!hasValidToken(token) || !userId) return;
    
    setLoading(true);
    setError(null);
    try {
      // Load feed and favorites in parallel
      const [feedRes, favoritesRes] = await Promise.all([
        getFeed(token).catch((error) => {
          if (error?.response?.status === 401 && error?.response?.data?.message?.includes('token')) {
            logout();
          }
          return { data: [] };
        }),
        getFavorites(userId, token).catch(() => ({ data: [] })),
      ]);


      // Load suggestions
      let suggestionsRes = { data: [] };
      
      try {
        suggestionsRes = await getSuggestions(token);
      } catch (error) {
        // AUTH suggestions failed, will try no-auth
      }
      
      // If no users from auth endpoint, try no-auth endpoint
      if (!suggestionsRes.data || suggestionsRes.data.length === 0) {
        try {
          suggestionsRes = await getSuggestionsNoAuth();
        } catch (error) {
          // NO-AUTH suggestions failed
        }
      }
      
      // Show all users except current user (don't filter by following status)
      const apiSugg = (suggestionsRes.data || [])
        .filter((u) => String(u.id) !== String(userId)) // Only exclude current user
        .map((u) => ({
          id: String(u.id),
          name: u.name,
          avatar: u.avatar,
          canFollow: true,
        }));
      
      setSuggestions(apiSugg);

      // Set favorites
      const favoritesData = favoritesRes.data || [];
      setUserFavorites(favoritesData);

      // Get current following state at the time of loading (not from dependency)
      const currentFollowing = await AsyncStorage.getItem(FOLLOW_CACHE_KEY(userId));
      const followingState = currentFollowing ? JSON.parse(currentFollowing) : {};
      const followedUserIds = Object.keys(followingState).filter(id => followingState[id] && id !== 'ts');
      const cleanFollowedUserIds = followedUserIds.filter(id => id !== 'ts');
      
      // Load stories from backend
      const allBackendUsers = suggestionsRes.data || [];
      setAllBackendUsers(allBackendUsers);
      
       try {
         const storiesRes = await getStories(token);
         
         // Backend returns grouped stories by user: [{ user: {...}, stories: [...] }]
         // Convert to grouped format expected by frontend - one entry per user with all their stories
         const backendStories = [];
         (storiesRes.data || []).forEach(userGroup => {
           const user = userGroup.user;
           
           // Create slides array from all stories of this user
           const slides = userGroup.stories.map(story => ({
             id: story.id,
             uri: story.book?.cover || FALLBACK_COVER,
             caption: story.content || story.book?.title || 'Mi historia'
           }));
           
           // Create one entry per user with all their stories as slides
           backendStories.push({
             id: user.id, // Use user ID instead of story ID
             name: user.name || 'Usuario',
             avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
             slides: slides
           });
         });
         
         setStories(backendStories);
      } catch (error) {
        console.error('Error loading stories:', error);
        setStories([]);
      }

       // Convert backend posts to our format
       const allBackendPosts = (feedRes.data || []).map((p) => {
         // Backend returns: { user: { id, name, avatar }, ... }
         // Frontend expects: { user: { id, name, avatar }, ... }
         const postUserId = p.user?.id;
         const postUserName = p.user?.name || 'Usuario desconocido';
         const postUserAvatar = p.user?.avatar || `https://i.pravatar.cc/150?u=${postUserId}`;
         
         // Only include posts with valid user IDs
         if (!postUserId || postUserId === 'unknown' || postUserId === 'undefined' || postUserId === 'null') {
           return null;
         }
         
         return {
           id: p.id,
           user: { id: String(postUserId), name: postUserName, avatar: postUserAvatar },
           text: p.text,
           book: p.book
             ? { title: p.book.title, author: p.book.author || '', cover: p.book.cover || FALLBACK_COVER }
             : null,
           likes: p.likes || 0,
           comments: (p.comments || []).map((c) => ({
             id: c.id,
             user: { id: String(c.user.id), name: c.user.name, avatar: c.user.avatar },
             text: c.text,
             time: c.time,
           })),
           time: p.time,
           _source: 'backend',
         };
       }).filter(Boolean); // Remove null entries
      
      // Filter posts to only show from followed users + current user (exclude timestamp)
      const allFollowedUsers = [...cleanFollowedUserIds, String(userId)];
      
      const relevantPosts = allBackendPosts.filter(post => 
        allFollowedUsers.includes(post.user.id)
      );
      
      // Get random 10 posts maximum
      const MAX_POSTS = 10;
      const randomPosts = getRandomPosts(relevantPosts, MAX_POSTS);
      
      setAllPosts(randomPosts);
      } catch (error) {
        setError('Error al cargar el feed');
      } finally {
      setLoading(false);
    }
  }, [token, userId, popular, logout]);

  useEffect(() => {
    if (token && userId) {
      loadRemote();
    }
  }, [token, userId, loadRemote]);

  // Load data when screen comes into focus - use the same logic as loadRemote for consistency
  useFocusEffect(
    useCallback(() => {
      if (!userId || !token) {
        return;
      }
      
      // Use the same loadRemote function to ensure consistency
      loadRemote();
    }, [userId, token])
  );

  const followedIds = useMemo(
    () => Object.keys(following).filter((k) => following[k]),
    [following],
  );
  const visibleFeed = useMemo(() => {
    return allPosts;
  }, [allPosts]);

  const filteredSuggestions = useMemo(() => {
    // Show all suggestions (already filtered in loadRemote)
    return suggestions;
  }, [suggestions]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Clear smart feed cache to get fresh random posts
      await AsyncStorage.removeItem(FEED_CACHE_KEY);
      await loadRemote();
      } catch (error) {
        // Silently handle refresh error
      } finally {
      setRefreshing(false);
    }
  }, [loadRemote]);




  const onLike = useCallback(
    async (postId) => {
      if (!hasValidToken(token)) return;
      
      // Optimistic update
      setAllPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p)),
      );
      
      try {
        const r = await likePost(postId, token);
        if (r?.data?.likes != null) {
          setAllPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, likes: r.data.likes } : p)),
          );
        }
      } catch (error) {
        // Only logout on clear 401 errors, not on network issues
        if (error?.response?.status === 401 && error?.response?.data?.message?.includes('token')) {
          logout();
        }
        // Revert optimistic update on error
        setAllPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: Math.max(0, (p.likes || 0) - 1) } : p)),
        );
      }
    },
    [token],
  );

  const onAddComment = useCallback(
    async (postId, text) => {
      if (!hasValidToken(token)) return;
      
      const newC = { id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, user: me, text, time: new Date().toISOString() };
      
      // Optimistic update
      setAllPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), newC] } : p)),
      );
      
      try {
        await commentPost(postId, text, token);
      } catch (error) {
        // Only logout on clear 401 errors, not on network issues
        if (error?.response?.status === 401 && error?.response?.data?.message?.includes('token')) {
          logout();
        }
        // Revert optimistic update on error
        setAllPosts((prev) =>
          prev.map((p) => (p.id === postId ? { 
            ...p, 
            comments: (p.comments || []).filter(c => c.id !== newC.id) 
          } : p)),
        );
      }
    },
    [me, token],
  );

  const handleCreatePost = useCallback(
    async (postData) => {
      if (!hasValidToken(token)) return;
      
      setPosting(true);
      try {
        const response = await createPost(postData, token);
        
        // Add the new post to the feed
        const newPost = {
          id: response.data.id,
          user: me,
          text: postData.text,
          book: postData.book,
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString(),
          _source: 'backend',
        };
        
        setAllPosts(prev => [newPost, ...prev]);
        
        Alert.alert('Éxito', 'Publicación creada correctamente');
      } catch (error) {
        console.error('Error creating post:', error);
        Alert.alert('Error', 'No se pudo crear la publicación');
      } finally {
        setPosting(false);
      }
    },
    [token, me, allPosts],
  );

  const handleFollowUser = useCallback(
    async (targetUserId) => {
      if (!hasValidToken(token)) return;
      
      // Use the same logic as onToggleFollow for consistency
      await onToggleFollow(targetUserId);
    },
    [onToggleFollow],
  );

  const handleUnfollowUser = useCallback(
    async (targetUserId) => {
      if (!hasValidToken(token)) return;
      
      // Use the same logic as onToggleFollow for consistency
      await onToggleFollow(targetUserId);
    },
    [onToggleFollow],
  );

  const publishStory = useCallback(
    async ({ caption, book }) => {
      if (!hasValidToken(token)) {
        Alert.alert('Error', 'No estás autenticado');
        return;
      }
      
      try {
        const storyData = {
          content: caption || (book?.title ?? 'Mi historia'),
          imageUrl: book ? (book.cover || book.coverUrl || book.image || FALLBACK_COVER) : FALLBACK_COVER,
          bookTitle: book?.title || null,
          bookCover: book ? (book.cover || book.coverUrl || book.image) : null
        };
        
        const response = await createStory(storyData, token);
        
        // Add the new story to the list
        const newStory = {
          id: response.data.id,
          name: me.name,
          avatar: me.avatar,
          slides: [{
            id: response.data.id,
            uri: storyData.imageUrl,
            caption: storyData.content
          }]
        };
        
        setStories((prev) => [newStory, ...prev]);
        setComposeStoryVisible(false);
        Alert.alert('Éxito', 'Historia publicada correctamente');
      } catch (error) {
        console.error('Error publishing story:', error);
        Alert.alert('Error', 'No se pudo publicar la historia');
      }
    },
    [me, token],
  );

  const onToggleFollow = useCallback(
    async (uid) => {
      
      if (!hasValidToken(token)) {
        return;
      }
      
      // Prevent following self
      if (String(uid) === String(userId)) {
        Alert.alert('Error', 'No puedes seguirte a ti mismo');
        return;
      }
      
      // Validate uid format
      if (!uid || uid === 'unknown' || uid === 'undefined' || uid === 'null') {
        Alert.alert('Error', 'ID de usuario no válido');
        return;
      }
      
      // Ensure uid is a valid number (backend expects integer)
      const cleanUid = parseInt(String(uid).trim(), 10);
      if (!cleanUid || isNaN(cleanUid)) {
        Alert.alert('Error', 'ID de usuario no válido');
        return;
      }
      
      // Check following status using both string and number keys
      const isCurrentlyFollowing = following[uid] || following[cleanUid] || following[String(cleanUid)];
      
      
      // Optimistic update - use functional update to avoid stale closure
      setFollowing(prevFollowing => {
        const newFollowingState = !isCurrentlyFollowing;
        const optimisticState = { ...prevFollowing, [cleanUid]: newFollowingState };
        
        // Save to cache immediately (async, don't wait)
        AsyncStorage.setItem(FOLLOW_CACHE_KEY(userId), JSON.stringify(optimisticState))
          .catch(() => {});
        
        return optimisticState;
      });
      
      try {
        let response;
        
        
        // Use specific follow/unfollow functions based on current state
        if (isCurrentlyFollowing) {
          response = await unfollowUser(cleanUid, token);
        } else {
          response = await followUser(cleanUid, token);
        }
        
        
        // Update state with server response using functional update
        setFollowing(prevFollowing => {
          const newFollowingState = response.data.following;
          const finalState = { ...prevFollowing, [cleanUid]: newFollowingState };
          
          // Save to cache with server response
          AsyncStorage.setItem(FOLLOW_CACHE_KEY(userId), JSON.stringify(finalState))
            .catch(() => {});
          
          // Immediately update UI state without waiting for full reload
          if (newFollowingState) {
            // User was followed - refresh feed to include new followed user's content
            // Load new posts from the followed user
            setTimeout(async () => {
              try {
                const feedRes = await getFeed(token);
                const newPosts = (feedRes.data || []).map((p) => {
                  const postUserId = p.user?.id;
                  const postUserName = p.user?.name || 'Usuario desconocido';
                  const postUserAvatar = p.user?.avatar || `https://i.pravatar.cc/150?u=${postUserId}`;
                  
                  if (!postUserId || postUserId === 'unknown' || postUserId === 'undefined' || postUserId === 'null') {
                    return null;
                  }
                  
                  return {
                    id: p.id,
                    user: { id: String(postUserId), name: postUserName, avatar: postUserAvatar },
                    text: p.text,
                    book: p.book
                      ? { title: p.book.title, author: p.book.author || '', cover: p.book.cover || FALLBACK_COVER }
                      : null,
                    likes: p.likes || 0,
                    comments: (p.comments || []).map((c) => ({
                      id: c.id,
                      user: { id: String(c.user.id), name: c.user.name, avatar: c.user.avatar },
                      text: c.text,
                      time: c.time,
                    })),
                    time: p.time,
                    _source: 'backend',
                  };
                }).filter(Boolean);
                
                // Filter to only show posts from followed users + current user
                const currentFollowing = await AsyncStorage.getItem(FOLLOW_CACHE_KEY(userId));
                const followingState = currentFollowing ? JSON.parse(currentFollowing) : {};
                const followedUserIds = Object.keys(followingState).filter(id => followingState[id] && id !== 'ts');
                const allFollowedUsers = [...followedUserIds, String(userId)];
                
                const relevantPosts = newPosts.filter(post => 
                  allFollowedUsers.includes(post.user.id)
                );
                
                setAllPosts(relevantPosts);
              } catch (error) {
                // Silently handle feed refresh error
              }
            }, 100);
          } else {
            // User was unfollowed - remove their posts and stories immediately
            setAllPosts(prevPosts => prevPosts.filter(post => post.user.id !== String(cleanUid)));
            setStories(prevStories => prevStories.filter(story => story.id !== String(cleanUid)));
          }
          
          return finalState;
        });
        
        // Force re-render of suggestions to update follow buttons immediately
        setSuggestions(prevSuggestions => prevSuggestions.map(s => ({ ...s })));
        setForceUpdate(prev => prev + 1);
        setRefreshKey(prev => prev + 1);
        
        // Also force re-render of posts to update unfollow buttons
        setAllPosts(prevPosts => prevPosts.map(p => ({ ...p })));
        
      } catch (error) {
        
        // Revert optimistic update on error using functional update
        setFollowing(prevFollowing => {
          const revertedState = { ...prevFollowing, [cleanUid]: isCurrentlyFollowing };
          
          // Save reverted state to cache
          AsyncStorage.setItem(FOLLOW_CACHE_KEY(userId), JSON.stringify(revertedState))
            .catch(() => {});
          
          return revertedState;
        });
        
        // Force re-render of suggestions to revert follow buttons immediately
        setSuggestions(prevSuggestions => prevSuggestions.map(s => ({ ...s })));
        setForceUpdate(prev => prev + 1);
        setRefreshKey(prev => prev + 1);
        
        // Also force re-render of posts to revert unfollow buttons
        setAllPosts(prevPosts => prevPosts.map(p => ({ ...p })));
        
        // Handle specific error cases
        const errorData = error.response?.data;
        const status = error.response?.status;
        
        if (status === 409) {
          // Conflict - likely already following/unfollowing
          const message = isCurrentlyFollowing 
            ? 'Ya no sigues a este usuario' 
            : 'Ya sigues a este usuario';
          Alert.alert('Conflicto', message);
          
          // Sync with server state - get the actual follow status
          try {
            const statusResponse = await getFollowStatus(cleanUid, token);
            const actualStatus = statusResponse.data.following;
            
            setFollowing(prevFollowing => {
              const correctedState = { ...prevFollowing, [cleanUid]: actualStatus };
              AsyncStorage.setItem(FOLLOW_CACHE_KEY(userId), JSON.stringify(correctedState))
                .catch(() => {});
              return correctedState;
            });
            
            // Force re-render of suggestions to update follow buttons immediately
            setSuggestions(prevSuggestions => prevSuggestions.map(s => ({ ...s })));
            setForceUpdate(prev => prev + 1);
            setRefreshKey(prev => prev + 1);
            
            // Also force re-render of posts to update unfollow buttons
            setAllPosts(prevPosts => prevPosts.map(p => ({ ...p })));
            
          } catch (syncError) {
            // Silently handle sync error
          }
        } else if (errorData?.error === 'CANNOT_FOLLOW_SELF') {
          Alert.alert('Error', 'No puedes seguirte a ti mismo');
        } else if (errorData?.error === 'INVALID_TARGET') {
          Alert.alert('Error', 'Usuario no válido');
        } else if (status === 401) {
          Alert.alert('Error', 'Sesión expirada. Por favor, inicia sesión nuevamente');
          logout();
        } else {
          Alert.alert('Error', `No se pudo cambiar el estado de seguimiento (${status || 'Error desconocido'})`);
        }
      }
    },
    [token, following, userId, logout],
  );

  const onToggleJoin = useCallback(
    async (clubId) => {
      setClubs((prev) =>
        prev.map((c) => (c.id === clubId ? { ...c, members: (c.members || 0) + 1 } : c)),
      );
      try {
        const r = await toggleJoinClub(clubId, token);
        if (r?.data?.members != null) {
          setClubs((prev) =>
            prev.map((c) => (c.id === clubId ? { ...c, members: r.data.members } : c)),
          );
        }
      } catch {}
    },
    [token],
  );

const submitCreateClub = useCallback(
  async ({ name, book, chapters }) => {
    if (!token) {
      Alert.alert('Error', 'No estás autenticado');
      return;
    }

    const cover = book ? book.cover || book.image || FALLBACK_COVER : FALLBACK_COVER;

    // Optimista: UI rápida
    const optimistic = { id: `tmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name, cover, members: 1 };
    setClubs((prev) => [optimistic, ...prev]);
    setCreateClubVisible(false);

    try {
      const resp = await createClub({ name, cover, chapters }, token);
      const newId = resp?.data?.id;

      // refresca lista
      const refreshed = await getClubs();
      setClubs(refreshed?.data || []);
      setCached(CLUBS_CACHE_KEY, refreshed?.data || []);

      // navega al club recién creado si tenemos id
      if (newId) {
        navigation.navigate('ClubRoom', { clubId: newId, clubName: name, cover });
      }
    } catch (error) {
      console.error('Error creating club:', error);
      // si falla, quita el optimista y vuelve a cargar desde servidor
      const refreshed = await getClubs().catch(() => ({ data: [] }));
      setClubs(refreshed?.data || []);
      setCached(CLUBS_CACHE_KEY, refreshed?.data || []);
      
      if (error?.response?.status === 401) {
        logout();
      } else {
        Alert.alert('Error', 'No se pudo crear el club. Inténtalo de nuevo.');
      }
    }
  },
  [token, navigation, logout],
);

  const followingCount = followedIds.length;

  if (error && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#e63946" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        key={refreshKey}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Social</Text>
              <Text style={styles.headerSubtitle}>Conecta con otros lectores</Text>
            </View>
            {user ? (
              <TouchableOpacity 
                style={styles.userAvatar}
                onPress={() => {
                  navigation?.navigate?.('Profile');
                }}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ 
                    uri: user.avatar || 'https://i.pravatar.cc/150?u=default',
                    cache: 'reload' // Force reload to avoid cache issues
                  }} 
                  style={styles.avatarImage} 
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.userAvatar}>
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150?u=default' }} 
                  style={styles.avatarImage}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Historias</Text>
            <View style={styles.activityActions}>
              <TouchableOpacity 
                style={styles.createTestUsersButton}
                onPress={async () => {
                  try {
                    await seedStories();
                    Alert.alert('Éxito', 'Historias de prueba creadas');
                     // Refresh stories
                     const storiesRes = await getStories(token);
                     const backendStories = (storiesRes.data || []).map(story => ({
                       id: story.id,
                       name: story.user?.name || 'Usuario',
                       avatar: story.user?.avatar || `https://i.pravatar.cc/150?u=${story.userId}`,
                       slides: [{
                         id: story.id,
                         uri: story.imageUrl || story.bookCover || FALLBACK_COVER,
                         caption: story.content || story.bookTitle || 'Mi historia'
                       }]
                     }));
                     setStories(backendStories);
                  } catch (error) {
                    console.error('Error seeding stories:', error);
                    Alert.alert('Error', 'No se pudieron crear las historias de prueba');
                  }
                }}
              >
                <MaterialIcons name="auto-fix-high" size={14} color="#5A4FFF" />
                <Text style={styles.createTestUsersText}>Crear historias</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setComposeStoryVisible(true)}
              >
                <MaterialIcons name="add" size={16} color="#5A4FFF" />
                <Text style={styles.sectionLink}>Nueva historia</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={stories}
            keyExtractor={(s, index) => s.id || `story_${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storyList}
            renderItem={({ item, index }) => (
              <StoryAvatar
                name={item.name}
                avatarUri={item.avatar}
                active={index % 2 === 0}
                onPress={() => setViewer({ open: true, index })}
              />
            )}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Actividad</Text>
            <View style={styles.activityActions}>
              {loading && <ActivityIndicator size="small" color="#5A4FFF" />}
              <TouchableOpacity 
                style={styles.addActivityButton}
                onPress={() => setCreatePostModalVisible(true)}
              >
                <MaterialIcons name="add" size={16} color="#5A4FFF" />
                <Text style={styles.addActivityText}>Crear Post</Text>
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5A4FFF" />
              <Text style={styles.loadingText}>Cargando actividad...</Text>
            </View>
          ) : visibleFeed.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="article" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                {followingCount === 0
                  ? 'Sigue a alguien para ver sus publicaciones.'
                  : 'Aún no hay publicaciones.'}
              </Text>
            </View>
          ) : (
            visibleFeed.map((p, index) => (
              <PostCard
                key={`${p.id}_${forceUpdate}` || `post_${index}_${forceUpdate}`}
                post={p}
                onLike={() => onLike(p.id)}
                onOpenComments={() => setCommentsFor(p)}
                onUnfollow={() => onToggleFollow(p.user.id)}
              />
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personas que quizá conozcas</Text>
          
          <FlatList
            data={filteredSuggestions}
            horizontal
            keyExtractor={(u, index) => String(u.id) || `user_${index}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestList}
            extraData={[following, forceUpdate]}
            renderItem={({ item }) => (
              <UserChip
                user={item}
                following={!!following[item.id]}
                onToggleFollow={() => onToggleFollow(item.id)}
              />
            )}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Clubs de lectura</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setCreateClubVisible(true)}
            >
              <MaterialIcons name="add" size={16} color="#5A4FFF" />
              <Text style={styles.sectionLink}>Crear club</Text>
            </TouchableOpacity>
          </View>
          {clubsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5A4FFF" />
              <Text style={styles.loadingText}>Cargando clubs...</Text>
            </View>
          ) : clubs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="group" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No hay clubs disponibles</Text>
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => setCreateClubVisible(true)}
              >
                <Text style={styles.createFirstText}>Crear el primer club</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={clubs}
              horizontal
              keyExtractor={(c, index) => c.id || `club_${index}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.clubList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('ClubRoom', {
                      clubId: item.id,
                      clubName: item.name,
                      cover: item.cover,
                    })
                  }
                >
                  <ClubCard club={item} joined={false} onToggleJoin={() => onToggleJoin(item.id)} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      <ComposeStoryModal
        visible={composeStoryVisible}
        onClose={() => setComposeStoryVisible(false)}
        onSubmit={publishStory}
        favorites={favorites}
      />

      {/* Asegúrate de que este modal envíe { name, book, chapters } */}
      <CreateClubModal
        visible={createClubVisible}
        onClose={() => setCreateClubVisible(false)}
        favorites={favorites}
        onSubmit={submitCreateClub}
      />

      <CommentSheet
        visible={!!commentsFor}
        post={commentsFor}
        onClose={() => setCommentsFor(null)}
        onAdd={(text) => commentsFor && onAddComment(commentsFor.id, text)}
      />

      <StoryViewer
        visible={viewer.open}
        stories={stories}
        startIndex={viewer.index}
        onClose={() => setViewer({ open: false, index: 0 })}
      />

      <CreatePostModal
        visible={createPostModalVisible}
        onClose={() => setCreatePostModalVisible(false)}
        onSubmit={handleCreatePost}
        loading={posting}
        favorites={userFavorites}
      />
    </SafeAreaView>
  );
}
