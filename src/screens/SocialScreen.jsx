import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import {
  View,
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
import { SocialStyles } from '../styles/components';
import { baseStyles, COLORS } from '../styles/baseStyles';
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
  createPost,
  deletePost,
} from '../api/api';
import { getTokenData } from '../utils/authContextUtils';
import { 
  getCached, 
  setCached, 
  hasValidToken, 
  loadFollowingState, 
  toggleFollowUser 
} from '../utils/socialUtils';
import { 
  loadStories, 
  publishStory as publishStoryUtil, 
  buildStorySlides 
} from '../utils/storyUtils';
import { 
  processFeedPosts, 
  createNewPost, 
  updatePostLikes, 
  addPostComment, 
  removePostComment, 
  filterPostsByUser 
} from '../utils/postProcessingUtils';
import { getBookCoverUri } from '../utils/imageUtils';
import { useCustomSafeArea } from '../utils/safeAreaUtils';

const CLUBS_CACHE_TTL = 5 * 60 * 1000;
const CLUBS_CACHE_KEY = 'social:clubs';
const POSTS_CACHE_KEY = 'social:posts';
const POSTS_CACHE_TTL = 5 * 60 * 1000;
const MAX_FEED_POSTS = 10;

export default function SocialScreen() {
  const navigation = useNavigation();
  const { token, logout, user } = useContext(AuthContext);
  const { getContainerStyle, getScrollStyle } = useCustomSafeArea();
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
  const [composeStoryVisible, setComposeStoryVisible] = useState(false);
  const [createClubVisible, setCreateClubVisible] = useState(false);
  const [commentsFor, setCommentsFor] = useState(null);
  const [viewer, setViewer] = useState({ open: false, index: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState({});
  const [error, setError] = useState(null);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [posting, setPosting] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  const me = useMemo(
    () => ({
      id: userId || 0,
      name: user?.name || 'Usuario',
      avatar: user?.avatar || `https://i.pravatar.cc/150?u=${userId || 'me'}`,
    }),
    [userId, user],
  );

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    } else if (token) {
      try {
        const tokenData = getTokenData(token);
        setUserId(tokenData?.userId || null);
      } catch {
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
        const followingState = await loadFollowingState(userId, token);
        if (isMounted) {
          setFollowing(followingState);
        }
      } catch (error) {
        if (isMounted) {
          setFollowing({});
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

  const coverUriFromBook = useCallback((book) => {
    return getBookCoverUri(book);
  }, []);

  const buildStorySlidesCallback = useCallback(
    (n = 2) => buildStorySlides(popular, n),
    [popular],
  );

  const loadRemote = useCallback(async () => {
    if (!hasValidToken(token) || !userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [feedRes, favoritesRes] = await Promise.all([
        getFeed(token).catch((error) => {
          if (error?.response?.status === 401 && error?.response?.data?.message?.includes('token')) {
            logout();
          }
          return { data: [] };
        }),
        getFavorites(userId, token).catch(() => ({ data: [] }))
      ]);

      let suggestionsRes = { data: [] };
      try {
        suggestionsRes = await getSuggestions(token);
      } catch {
        try {
          suggestionsRes = await getSuggestionsNoAuth();
        } catch {}
      }
      
      const apiSugg = (suggestionsRes.data || [])
        .filter((u) => String(u.id) !== String(userId))
        .map((u) => ({
          id: String(u.id),
          name: u.name,
          avatar: u.avatar,
          canFollow: true,
        }));
      
      setSuggestions(apiSugg);
      setUserFavorites(favoritesRes.data || []);

      const followedUserIds = Object.keys(following).filter(id => 
        following[id] && id !== 'ts'
      );
      
      const stories = await loadStories(token, userId, user);
      setStories(stories);
      
      const posts = processFeedPosts(feedRes.data, followedUserIds, userId, MAX_FEED_POSTS);
      setAllPosts(posts);
      
      await setCached(POSTS_CACHE_KEY, posts);
    } catch (error) {
      setError('Error al cargar el feed');
    } finally {
      setLoading(false);
    }
  }, [token, userId, user, logout, following]);



  useFocusEffect(
    useCallback(() => {
      if (!userId || !token) return;
      loadRemote();
      
      // Refresh clubs to sync with other devices
      getClubs().then(res => {
        if (res?.data) {
          setClubs(res.data);
          setCached(CLUBS_CACHE_KEY, res.data);
        }
      }).catch(() => {});
    }, [userId, token, loadRemote])
  );

  const followedIds = useMemo(
    () => Object.keys(following).filter((k) => following[k]),
    [following],
  );
  const visibleFeed = useMemo(() => {
    return allPosts;
  }, [allPosts]);

  const filteredSuggestions = useMemo(() => {
    // Show all suggestions
    return suggestions;
  }, [suggestions]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadRemote();
    } catch (error) {
      // Handle refresh error
    } finally {
      setRefreshing(false);
    }
  }, [loadRemote]);




  const onLike = useCallback(
    async (postId) => {
      if (!hasValidToken(token)) return;
      
      setAllPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p))
      );
      
      try {
        const r = await likePost(postId, token);
        if (r?.data?.likes != null) {
          setAllPosts((prev) => updatePostLikes(prev, postId, r.data.likes));
        }
      } catch (error) {
        if (error?.response?.status === 401 && error?.response?.data?.message?.includes('token')) {
          logout();
        }
        setAllPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: Math.max(0, (p.likes || 0) - 1) } : p))
        );
      }
    },
    [token, logout],
  );

  const onAddComment = useCallback(
    async (postId, text) => {
      if (!hasValidToken(token)) return;
      
      const newC = { 
        id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
        user: me, 
        text, 
        time: new Date().toISOString() 
      };
      
      setAllPosts((prev) => addPostComment(prev, postId, newC));
      
      try {
        await commentPost(postId, text, token);
      } catch (error) {
        if (error?.response?.status === 401 && error?.response?.data?.message?.includes('token')) {
          logout();
        }
        setAllPosts((prev) => removePostComment(prev, postId, newC.id));
      }
    },
    [me, token, logout],
  );

  const handleCreatePost = useCallback(
    async (postData) => {
      if (!hasValidToken(token)) return;
      
      if (!userId) {
        Alert.alert('Error', 'No se pudo identificar al usuario. Inténtalo de nuevo.');
        return;
      }
      
      setPosting(true);
      try {
        const response = await createPost(postData, token);
        const newPost = createNewPost(response.data, userId, user);
        setAllPosts(prev => [newPost, ...prev]);
        Alert.alert('Éxito', 'Publicación creada correctamente');
      } catch (error) {
        Alert.alert('Error', 'No se pudo crear la publicación');
      } finally {
        setPosting(false);
      }
    },
    [userId, user, token],
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
          bookTitle: book?.title || null,
          bookCover: getBookCoverUri(book)
        };
        
        const result = await publishStoryUtil(storyData, token);
        
        if (result.success) {
          await loadRemote();
          setComposeStoryVisible(false);
          Alert.alert('Éxito', 'Historia publicada correctamente');
        } else {
          Alert.alert('Error', 'No se pudo publicar la historia');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo publicar la historia');
      }
    },
    [token, loadRemote],
  );

  const handleBookPress = useCallback((book) => {
    if (!book || !book.id) return;

    let bookKey;
    if (book.id.includes('/books/')) {
      bookKey = book.id.split('/books/')[1];
    } else if (book.id.match(/^\d{10,13}$/)) {
      bookKey = book.id;
    } else {
      bookKey = book.id;
    }

    navigation.navigate('BookDetail', {
      book: book,
      bookKey: bookKey
    });
  }, [navigation]);

  const handleDeletePost = useCallback(async (postId) => {
    try {
      await deletePost(postId, token);
      setAllPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la publicación. Inténtalo de nuevo.');
    }
  }, [token]);

  const onToggleFollow = useCallback(
    async (uid) => {
      if (!hasValidToken(token)) return;
      
      if (String(uid) === String(userId)) {
        Alert.alert('Error', 'No puedes seguirte a ti mismo');
        return;
      }
      
      if (!uid || uid === 'unknown' || uid === 'undefined' || uid === 'null') {
        Alert.alert('Error', 'ID de usuario no válido');
        return;
      }
      
      const cleanUid = parseInt(String(uid).trim(), 10);
      if (!cleanUid || isNaN(cleanUid)) {
        Alert.alert('Error', 'ID de usuario no válido');
        return;
      }
      
      const isCurrentlyFollowing = following[uid] || following[cleanUid] || following[String(cleanUid)];
      
      setFollowing(prevFollowing => {
        const newFollowingState = !isCurrentlyFollowing;
        const optimisticState = { ...prevFollowing, [cleanUid]: newFollowingState };
        return optimisticState;
      });
      
      try {
        const result = await toggleFollowUser(uid, userId, token, following);
        
        if (result.success) {
          setFollowing(result.following);
          
          if (result.newState) {
            try {
              const feedRes = await getFeed(token);
              const followedUserIds = Object.keys(result.following).filter(id => result.following[id] && id !== 'ts');
              const newPosts = processFeedPosts(feedRes.data, followedUserIds, userId, MAX_FEED_POSTS);
              
              // Only add new posts from the followed user  
              setAllPosts(prevPosts => {
                const existingPostIds = new Set(prevPosts.map(p => p.id));
                const newUserPosts = newPosts.filter(post => 
                  post.user.id === String(cleanUid) && !existingPostIds.has(post.id)
                );
                return [...newUserPosts, ...prevPosts];
              });
            } catch (error) {
              // Handle feed refresh error
            }
          } else {
            // User was unfollowed - remove their posts and stories immediately
            setAllPosts(prevPosts => filterPostsByUser(prevPosts, cleanUid));
            setStories(prevStories => prevStories.filter(story => story.id !== String(cleanUid)));
          }
        } else {
          setFollowing(prevFollowing => {
            const revertedState = { ...prevFollowing, [cleanUid]: isCurrentlyFollowing };
            return revertedState;
          });
          
          if (result.error === 'Cannot follow self') {
            Alert.alert('Error', 'No puedes seguirte a ti mismo');
          } else if (result.error === 'Invalid user') {
            Alert.alert('Error', 'Usuario no válido');
          } else if (result.error === 'Unauthorized') {
            Alert.alert('Error', 'Sesión expirada. Por favor, inicia sesión nuevamente');
            logout();
          } else {
            Alert.alert('Error', `No se pudo cambiar el estado de seguimiento`);
          }
        }
      } catch (error) {
        setFollowing(prevFollowing => {
          const revertedState = { ...prevFollowing, [cleanUid]: isCurrentlyFollowing };
          return revertedState;
        });
        Alert.alert('Error', 'No se pudo cambiar el estado de seguimiento');
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

    const cover = getBookCoverUri(book);
    const optimistic = { 
      id: `tmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
      name, 
      cover, 
      members: 1 
    };
    
    setClubs((prev) => [optimistic, ...prev]);
    setCreateClubVisible(false);

    try {
      const resp = await createClub({ name, cover, chapters }, token);
      const newId = resp?.data?.id;

      const refreshed = await getClubs();
      setClubs(refreshed?.data || []);
      setCached(CLUBS_CACHE_KEY, refreshed?.data || []);

      if (newId) {
        navigation.navigate('ClubRoom', { clubId: newId, clubName: name, cover });
      }
    } catch (error) {
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

  const containerStyle = [baseStyles.container, getContainerStyle()];
  const scrollStyle = [baseStyles.scroll, getScrollStyle()];

  if (error && !loading) {
    return (
      <View style={containerStyle}>
        <View style={SocialStyles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#e63946" />
          <Text style={SocialStyles.errorText}>{error}</Text>
          <TouchableOpacity style={SocialStyles.retryButton} onPress={onRefresh}>
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={SocialStyles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={SocialStyles.backgroundDecoration} />
      <ScrollView
        contentContainerStyle={scrollStyle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={SocialStyles.headerContent}>
          <View style={SocialStyles.headerInfo}>
            <Text style={baseStyles.headerTitle}>Social</Text>
            <Text style={baseStyles.headerSubtitle}>Conecta con otros lectores</Text>
          </View>
          {user ? (
            <TouchableOpacity 
              style={SocialStyles.userAvatar}
              onPress={() => navigation?.navigate?.('Profile')}
              activeOpacity={0.7}
            >
              <Image 
                source={{ 
                  uri: user.avatar || 'https://i.pravatar.cc/150?u=default',
                  cache: 'reload'
                }} 
                style={SocialStyles.avatarImage} 
              />
            </TouchableOpacity>
          ) : (
            <View style={SocialStyles.userAvatar}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=default' }} 
                style={SocialStyles.avatarImage}
              />
            </View>
          )}
        </View>

        <View style={[baseStyles.card, { marginTop: 16 }]}>
          <View style={baseStyles.rowBetween}>
            <Text style={baseStyles.sectionTitle}>Historias</Text>
            <TouchableOpacity 
              style={SocialStyles.actionButton}
              onPress={() => setComposeStoryVisible(true)}
            >
              <MaterialIcons name="add" size={16} color="#5A4FFF" />
              <Text style={baseStyles.sectionLink}>Crear historia</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={stories}
            keyExtractor={(s, index) => s.id || `story_${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={SocialStyles.storyList}
            renderItem={({ item, index }) => (
              <StoryAvatar
                name={item.name}
                avatarUri={item.avatar}
                active={item.slides && item.slides.length > 0}
                onPress={() => {
                  if (item.isCurrentUser) {
                    const currentUserIndex = stories.findIndex(story => story.isCurrentUser);
                    if (currentUserIndex >= 0) {
                      setViewer({ open: true, index: currentUserIndex });
                    } else {
                      const tempCurrentUserStory = {
                        id: userId,
                        name: 'Tú',
                        avatar: user?.avatar || `https://i.pravatar.cc/150?u=${userId}`,
                        slides: [],
                        isCurrentUser: true
                      };
                      setStories(prev => [tempCurrentUserStory, ...prev]);
                      setViewer({ open: true, index: 0 });
                    }
                  } else {
                    setViewer({ open: true, index });
                  }
                }}
              />
            )}
          />
        </View>

        <View style={[baseStyles.card, { marginTop: 24 }]}>
          <View style={[baseStyles.rowBetween, { marginBottom: 16 }]}>
            <Text style={baseStyles.sectionTitle}>Actividad</Text>
            <View style={SocialStyles.activityActions}>
              {loading && <ActivityIndicator size="small" color={COLORS.ACCENT} />}
              <TouchableOpacity 
                style={SocialStyles.addActivityButton}
                onPress={() => setCreatePostModalVisible(true)}
              >
                <MaterialIcons name="add" size={16} color={COLORS.ACCENT} />
                <Text style={SocialStyles.addActivityText}>Crear Post</Text>
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <View style={SocialStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#5A4FFF" />
              <Text style={SocialStyles.loadingText}>Cargando actividad...</Text>
            </View>
          ) : visibleFeed.length === 0 ? (
            <View style={SocialStyles.emptyContainer}>
              <MaterialIcons name="article" size={48} color="#ccc" />
              <Text style={SocialStyles.emptyText}>
                {followingCount === 0
                  ? 'Sigue a alguien para ver sus publicaciones.'
                  : 'Aún no hay publicaciones.'}
              </Text>
            </View>
          ) : (
            visibleFeed.map((p, index) => (
              <PostCard
                key={p.id}
                post={p}
                onLike={() => onLike(p.id)}
                onOpenComments={() => setCommentsFor(p)}
                onUnfollow={() => onToggleFollow(p.user.id)}
                onBookPress={handleBookPress}
                onDelete={handleDeletePost}
                currentUserId={userId}
              />
            ))
          )}
        </View>

        <View style={baseStyles.card}>
          <Text style={baseStyles.sectionTitle}>Personas que quizá conozcas</Text>
          
          <FlatList
            data={filteredSuggestions}
            horizontal
            keyExtractor={(u, index) => String(u.id) || `user_${index}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={SocialStyles.suggestList}
            extraData={following}
            renderItem={({ item }) => (
              <UserChip
                user={item}
                following={!!following[item.id]}
                onToggleFollow={() => onToggleFollow(item.id)}
              />
            )}
          />
        </View>

        <View style={baseStyles.card}>
          <View style={baseStyles.rowBetween}>
            <Text style={baseStyles.sectionTitle}>Clubs de lectura</Text>
            <TouchableOpacity 
              style={SocialStyles.actionButton}
              onPress={() => setCreateClubVisible(true)}
            >
              <MaterialIcons name="add" size={16} color="#5A4FFF" />
              <Text style={baseStyles.sectionLink}>Crear club</Text>
            </TouchableOpacity>
          </View>
          {clubs.length === 0 ? (
            <View style={SocialStyles.emptyContainer}>
              <MaterialIcons name="group" size={48} color="#ccc" />
              <Text style={SocialStyles.emptyText}>No hay clubs disponibles</Text>
              <TouchableOpacity 
                style={SocialStyles.createFirstButton}
                onPress={() => setCreateClubVisible(true)}
              >
                <Text style={SocialStyles.createFirstText}>Crear el primer club</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={clubs}
              horizontal
              keyExtractor={(c, index) => c.id || `club_${index}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={SocialStyles.clubList}
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
    </View>
  );
}
