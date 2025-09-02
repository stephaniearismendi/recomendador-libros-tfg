import AsyncStorage from '@react-native-async-storage/async-storage';

const K_POSTS = 'social_posts';
const K_FOLLOWS = 'social_follows';
const K_CLUBS = 'social_joined_clubs';

export async function loadPosts() {
  try { const v = await AsyncStorage.getItem(K_POSTS); return v ? JSON.parse(v) : seed(); } catch { return seed(); }
}
export async function savePosts(posts) {
  try { await AsyncStorage.setItem(K_POSTS, JSON.stringify(posts)); } catch {}
}
export async function loadFollows() {
  try { const v = await AsyncStorage.getItem(K_FOLLOWS); return v ? JSON.parse(v) : {}; } catch { return {}; }
}
export async function saveFollows(map) {
  try { await AsyncStorage.setItem(K_FOLLOWS, JSON.stringify(map)); } catch {}
}
export async function loadJoinedClubs() {
  try { const v = await AsyncStorage.getItem(K_CLUBS); return v ? JSON.parse(v) : {}; } catch { return {}; }
}
export async function saveJoinedClubs(map) {
  try { await AsyncStorage.setItem(K_CLUBS, JSON.stringify(map)); } catch {}
}

function seed() {
  return [
    {
      id: 'p_seed_1',
      user: { id: 'u_seed_1', name: 'María', avatar: 'https://i.pravatar.cc/150?img=5' },
      time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      text: 'Acabé “La historia interminable”. Final precioso.',
      book: {
        title: 'The Neverending Story',
        author: 'M. Ende',
        cover: 'https://covers.openlibrary.org/b/id/8231856-M.jpg',
      },
      likes: 37,
      comments: [
        { id: 'c1', user: { id: 'u2', name: 'Lucas', avatar: 'https://i.pravatar.cc/150?img=11' }, text: 'Qué ganas!', time: new Date().toISOString() },
      ],
    },
    {
      id: 'p_seed_2',
      user: { id: 'u_seed_2', name: 'Sofía', avatar: 'https://i.pravatar.cc/150?img=48' },
      time: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      text: 'Relectura de “Emma”. Jane nunca falla.',
      book: {
        title: 'Emma',
        author: 'Jane Austen',
        cover: 'https://covers.openlibrary.org/b/id/10615647-M.jpg',
      },
      likes: 58,
      comments: [],
    },
  ];
}
