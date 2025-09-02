import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, SafeAreaView, ScrollView, Text, TouchableOpacity, FlatList,
  ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import StoryAvatar from '../components/StoryAvatar';
import StoryViewer from '../components/StoryViewer';
import PostCard from '../components/PostCard';
import UserChip from '../components/UserChip';
import ClubCard from '../components/ClubCard';
import ComposeStoryModal from '../components/ComposeStoryModal';
import CreateClubModal from '../components/CreateClubModal';
import CommentSheet from '../components/CommentSheet';
import styles from '../styles/socialStyles';
import {
  getFavorites, getPopularBooks, getFeed, likePost, commentPost,
  getClubs, toggleJoinClub, createClub, getRandomUsers, getSuggestions
} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const FALLBACK_COVER = 'https://covers.openlibrary.org/b/id/240727-M.jpg';

export default function SocialScreen() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

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
  const [following, setFollowing] = useState({}); // { [userId]: true }

  const me = useMemo(() => ({
    id: userId || 0,
    name: 'Tú',
    avatar: `https://i.pravatar.cc/150?u=${userId || 'me'}`
  }), [userId]);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) {
        setToken(t);
        try { setUserId(jwtDecode(t)?.userId || null); } catch {}
      }
      const [clubsRes, popRes] = await Promise.all([
        getClubs().catch(() => ({ data: [] })),
        getPopularBooks().catch(() => ({ data: [] }))
      ]);
      setClubs(clubsRes.data || []);
      setPopular(popRes.data || []);
    })();
  }, []);

  useEffect(() => {
    if (!userId || !token) return;
    (async () => {
      try {
        const favs = await getFavorites(userId, token);
        setFavorites(favs?.data || []);
      } catch { setFavorites([]); }
    })();
  }, [userId, token]);

  const coverUriFromBook = useCallback((b) => {
    const s = typeof b?.image === 'string' ? b.image : null;
    const o = typeof b?.image === 'object' && b?.image?.uri ? b.image.uri : null;
    const direct = s || o || b?.cover || b?.coverUrl;
    if (direct) return direct;
    if (b?.cover_i) return `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`;
    if (Array.isArray(b?.isbn) && b.isbn.length > 0) return `https://covers.openlibrary.org/b/isbn/${b.isbn[0]}-M.jpg`;
    if (b?.title) return `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`;
    return FALLBACK_COVER;
  }, []);

  const buildStorySlides = useCallback((n = 2) => {
    const pool = popular.length ? popular : [];
    const slides = [];
    for (let i = 0; i < n; i++) {
      const b = pool[Math.floor(Math.random() * Math.max(1, pool.length))];
      if (!b) break;
      slides.push({
        id: `${b.id || b.title}-${i}`,
        uri: coverUriFromBook(b),
        caption: `${b.title} · ${b.author || ''}`.trim()
      });
    }
    return slides.length ? slides : [{ id: 'fb', uri: FALLBACK_COVER, caption: 'Historia' }];
  }, [popular, coverUriFromBook]);

  const loadRemote = useCallback(async () => {
    setLoading(true);
    try {
      const [feedRes, suggestionsRes, randRes] = await Promise.all([
        getFeed(token).catch(() => ({ data: [] })),
        getSuggestions(token).catch(() => ({ data: [] })),
        getRandomUsers(12).catch(() => ({ data: { results: [] } }))
      ]);

      const apiSugg = (suggestionsRes.data || []).map(u => ({
        id: String(u.id),
        name: u.name,
        avatar: u.avatar
      }));
      const ru = randRes.data?.results || [];
      const rndSugg = ru.map(r => ({
        id: r.login?.uuid,
        name: `${cap(r.name?.first)} ${cap(r.name?.last)}`,
        avatar: r.picture?.medium || r.picture?.thumbnail
      }));
      const people = (apiSugg.length ? apiSugg : rndSugg).slice(0, 10);
      setSuggestions(people);

      setStories(people.slice(0, 8).map(p => ({
        id: p.id, name: p.name, avatar: p.avatar, slides: buildStorySlides(2)
      })));

      const textos = [
        'Acabo de terminarlo y me encantó.',
        '¿Quién más lo ha leído?',
        'Capítulo 5 y ya me tiene atrapada.',
        'Releyéndolo por tercera vez 💫',
      ];
      const booksPool = popular.length ? popular : [];
      const generated = people.slice(0, 8).map((u, i) => {
        const b = booksPool[Math.floor(Math.random() * Math.max(1, booksPool.length))];
        const book = b ? {
          title: b.title,
          author: b.author || 'Autor desconocido',
          cover: coverUriFromBook(b)
        } : null;
        return {
          id: `p_${u.id}_${i}`,
          user: u,
          text: textos[i % textos.length],
          book,
          likes: Math.floor(Math.random() * 50),
          comments: []
        };
      });

      const backendPosts = (feedRes.data || []).map(p => ({
        id: p.id,
        user: { id: String(p.userId), name: p.userName, avatar: p.userAvatar },
        text: p.text,
        book: p.bookTitle ? {
          title: p.bookTitle, author: p.bookAuthor || '', cover: p.bookCover || FALLBACK_COVER
        } : null,
        likes: (p.likes || []).length,
        comments: (p.comments || []).map(c => ({
          id: c.id,
          user: { id: String(c.userId), name: c.userName, avatar: c.userAvatar },
          text: c.text,
          time: c.createdAt
        }))
      }));

      setAllPosts([...backendPosts, ...generated]);
    } finally {
      setLoading(false);
    }
  }, [token, popular, buildStorySlides, coverUriFromBook]);

  useEffect(() => { if (token) loadRemote(); }, [token, loadRemote]);

  const followedIds = useMemo(
    () => Object.keys(following).filter(k => following[k]),
    [following]
  );

  const visibleFeed = useMemo(() => {
    if (followedIds.length === 0) return [];
    const setIds = new Set(followedIds.map(String));
    return allPosts.filter(p => setIds.has(String(p?.user?.id)));
  }, [allPosts, followedIds]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRemote();
    setRefreshing(false);
  }, [loadRemote]);

  const onLike = useCallback(async (postId) => {
    setAllPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    try {
      const r = await likePost(postId, token);
      if (r?.data?.likes != null) {
        setAllPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: r.data.likes } : p));
      }
    } catch {}
  }, [token]);

  const onAddComment = useCallback(async (postId, text) => {
    const newC = { id: `c_${Date.now()}`, user: me, text, time: new Date().toISOString() };
    setAllPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newC] } : p));
    try { await commentPost(postId, text, token); } catch {}
  }, [me, token]);

  const publishStory = useCallback(({ caption, book }) => {
    const cover = book ? (book.cover || book.coverUrl || book.image || FALLBACK_COVER) : FALLBACK_COVER;
    const myStory = {
      id: `me_${Date.now()}`,
      name: me.name,
      avatar: me.avatar,
      slides: [{ id: `s_${Date.now()}`, uri: cover, caption: caption || (book?.title ?? 'Mi historia') }]
    };
    setStories(prev => [myStory, ...prev]);
    setComposeStoryVisible(false);
  }, [me]);

  const onToggleFollow = useCallback((uid) => {
    setFollowing(prev => ({ ...prev, [uid]: !prev[uid] }));
  }, []);

  const onToggleJoin = useCallback(async (clubId) => {
    setClubs(prev => prev.map(c => c.id === clubId ? { ...c, members: (c.members || 0) + 1 } : c));
    try {
      const r = await toggleJoinClub(clubId, token);
      if (r?.data?.members != null) {
        setClubs(prev => prev.map(c => c.id === clubId ? { ...c, members: r.data.members } : c));
      }
    } catch {}
  }, [token]);

  const submitCreateClub = useCallback(async ({ name, book }) => {
    const cover = book ? (book.cover || book.image || FALLBACK_COVER) : FALLBACK_COVER;
    const optimistic = { id: `club_${Date.now()}`, name, cover, members: 1 };
    setClubs(prev => [optimistic, ...prev]);
    setCreateClubVisible(false);
    try { await createClub({ name, cover }, token); } catch {}
  }, [token]);

  const followingCount = followedIds.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Historias</Text>
            <TouchableOpacity onPress={() => setComposeStoryVisible(true)}>
              <Text style={styles.sectionLink}>Nueva historia</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={stories}
            keyExtractor={(s) => s.id}
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
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#5A4FFF" />
          ) : visibleFeed.length === 0 ? (
            <Text style={styles.emptyText}>
              {followingCount === 0
                ? 'Sigue a alguien para ver sus publicaciones.'
                : 'Aún no hay publicaciones.'}
            </Text>
          ) : (
            visibleFeed.map(p => (
              <PostCard
                key={p.id}
                post={p}
                onLike={() => onLike(p.id)}
                onOpenComments={() => setCommentsFor(p)}
              />
            ))
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Personas que quizá conozcas</Text>
            <Text style={styles.sectionHint}>
              {followingCount > 0 ? `Sigues a ${followingCount}` : ''}
            </Text>
          </View>
          <FlatList
            data={suggestions}
            horizontal
            keyExtractor={(u) => String(u.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestList}
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
            <TouchableOpacity onPress={() => setCreateClubVisible(true)}>
              <Text style={styles.sectionLink}>Crear club</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={clubs}
            horizontal
            keyExtractor={(c) => c.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.clubList}
            renderItem={({ item }) => (
              <ClubCard
                club={item}
                joined={false}
                onToggleJoin={() => onToggleJoin(item.id)}
              />
            )}
          />
        </View>
      </ScrollView>

      <ComposeStoryModal
        visible={composeStoryVisible}
        onClose={() => setComposeStoryVisible(false)}
        onSubmit={publishStory}
        favorites={favorites}
      />

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
    </SafeAreaView>
  );
}

function cap(s) { const x = s || ''; return x.slice(0,1).toUpperCase() + x.slice(1); }
