import axios from 'axios';
import { API_URL } from '../../config';

/* ───────────── Helpers ───────────── */

const authHeaders = (token) => {
  if (!token) return { headers: {} };

  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  return { headers: { Authorization: `Bearer ${cleanToken}` } };
};

const firstIsbn = (book = {}) => {
  if (Array.isArray(book.isbn) && book.isbn[0]) return String(book.isbn[0]);
  if (typeof book.primary_isbn13 === 'string' && book.primary_isbn13) return book.primary_isbn13;
  if (typeof book.primary_isbn10 === 'string' && book.primary_isbn10) return book.primary_isbn10;
  if (typeof book.isbn13 === 'string' && book.isbn13) return book.isbn13;
  if (typeof book.isbn10 === 'string' && book.isbn10) return book.isbn10;
  if (Array.isArray(book.isbns) && (book.isbns[0]?.isbn13 || book.isbns[0]?.isbn10)) {
    return book.isbns[0].isbn13 || book.isbns[0].isbn10;
  }
  return null;
};

export const coverFrom = (book = {}) => {
  const direct =
    book.image ||
    book.image?.uri ||
    book.book_image ||
    book.imageUrl ||
    book.coverUrl ||
    book.cover;
  if (direct) return direct;

  const isbn = firstIsbn(book);
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

  if (book.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  if (book.title)
    return `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-M.jpg`;
  return null;
};

const asPathBookId = (raw) => {
  const cleanId = String(raw ?? '').trim();
  const withSlash = cleanId.startsWith('/') ? cleanId : `/${cleanId}`;
  return encodeURIComponent(withSlash);
};

/* ───────────── Auth ───────────── */

export const register = (userData) => axios.post(`${API_URL}/users/register`, userData);

export const login = (credentials) => axios.post(`${API_URL}/users/login`, credentials);

export const getUserIdFromToken = (token) => axios.get(`${API_URL}/users/me`, authHeaders(token));

/* ───────────── Books ───────────── */

export const getBooks = (token) => axios.get(`${API_URL}/books`, authHeaders(token));

export const searchBooks = (query = 'bestsellers') =>
  axios.get(`${API_URL}/books/search?q=${encodeURIComponent(query)}`);

export const getPopularBooks = () => axios.get(`${API_URL}/books/popular`);

export const getBooksByGenre = (genre) =>
  axios.get(`${API_URL}/books/genre?g=${encodeURIComponent(genre)}`);

export const getBookDetails = (key) => {
  const cleanedKey = key?.replace?.(/^\/?works\//, '') ?? key;
  return axios.get(`${API_URL}/books/${cleanedKey}/details`);
};

export const getAdaptedBooks = () => axios.get(`${API_URL}/books/adapted`);

export const getNewYorkTimesBooks = () => axios.get(`${API_URL}/books/nytBooks`);

export const getPersonalRecommendations = (payload, token) =>
  axios.post(`${API_URL}/recommendations/personal`, payload, authHeaders(token));

export const getBookById = (bookId) => axios.get(`${API_URL}/books/${encodeURIComponent(bookId)}`);

/* ───────────── Favorites ───────────── */

export const getFavorites = (userId, token) =>
  axios.get(`${API_URL}/books/favorites/${userId}`, authHeaders(token));

export const addFavorite = (userId, bookOrId, token) => {
  const id =
    typeof bookOrId === 'string' || typeof bookOrId === 'number'
      ? String(bookOrId)
      : String(bookOrId?.id);

  const img = typeof bookOrId === 'object' ? coverFrom(bookOrId) || null : null;

  const body =
    typeof bookOrId === 'object'
      ? {
          title: bookOrId.title,
          author: bookOrId.author,
          imageUrl: img,
          image: img,
          description: bookOrId.description ?? null,
          rating: bookOrId.rating ?? null,
          category: bookOrId.genre ?? null,
          book_image: bookOrId.book_image ?? null,
          primary_isbn13: bookOrId.primary_isbn13 ?? null,
          primary_isbn10: bookOrId.primary_isbn10 ?? null,
          isbns: bookOrId.isbns ?? null,
          isbn: bookOrId.isbn ?? null,
        }
      : {};

  const pathId = asPathBookId(id);
  return axios.post(`${API_URL}/favorites/${userId}/${pathId}`, body, authHeaders(token));
};

export const removeFavorite = (userId, bookId, token) => {
  const pathId = asPathBookId(bookId);
  return axios.delete(`${API_URL}/favorites/${userId}/${pathId}`, authHeaders(token));
};

/* ───────────── Social ───────────── */

export const getFeed = (token) =>
  token
    ? axios.get(`${API_URL}/social/feed`, authHeaders(token))
    : axios.get(`${API_URL}/social/feed`);

export const createPost = (payload, token) =>
  axios.post(`${API_URL}/social/posts`, payload, authHeaders(token));

export const likePost = (postId, token) =>
  axios.post(`${API_URL}/social/posts/${postId}/like`, {}, authHeaders(token));

export const commentPost = (postId, text, token) =>
  axios.post(`${API_URL}/social/posts/${postId}/comments`, { text }, authHeaders(token));

export const deletePost = (postId, token) =>
  axios.delete(`${API_URL}/social/posts/${postId}`, authHeaders(token));

export const getClubs = () => axios.get(`${API_URL}/social/clubs`);

export const toggleJoinClub = (clubId, token) =>
  axios.post(`${API_URL}/social/clubs/${clubId}/toggle`, {}, authHeaders(token));

export const getRandomUsers = (count = 8) =>
  axios.get('https://randomuser.me/api/', {
    params: { results: count, inc: 'name,picture,login', noinfo: 1, nat: 'es,gb,fr,de,it' },
  });

export const getSuggestions = (token) =>
  axios.get(`${API_URL}/social/suggestions`, authHeaders(token));

export const getSuggestionsNoAuth = () => axios.get(`${API_URL}/social/suggestions-no-auth`);

export const followUser = (userId, token) =>
  axios.post(`${API_URL}/social/follow/${userId}`, {}, authHeaders(token));

export const unfollowUser = (userId, token) =>
  axios.delete(`${API_URL}/social/follow/${userId}`, authHeaders(token));

export const getFollowStatus = (userId, token) =>
  axios.get(`${API_URL}/social/follow/${userId}/status`, authHeaders(token));

export const getFollowing = (userId, token) =>
  axios.get(`${API_URL}/social/users/${userId}/following`, authHeaders(token));

/* ───────────── Stories ───────────── */

export const createStory = (storyData, token) =>
  axios.post(`${API_URL}/social/stories`, storyData, authHeaders(token));

export const getStories = (token) => axios.get(`${API_URL}/social/stories`, authHeaders(token));

export const getUserStories = (userId) =>
  axios.get(`${API_URL}/social/stories/user/${String(userId)}`);

/* ───────────── Clubs ───────────── */

export const createClub = (payload, token) =>
  axios.post(`${API_URL}/social/clubs`, payload, authHeaders(token));

export const getClub = (clubId) =>
  axios.get(`${API_URL}/social/clubs/${encodeURIComponent(clubId)}`);

export const getClubChapters = (clubId) =>
  axios.get(`${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters`);

export const createClubChapter = (clubId, data, token) =>
  axios.post(
    `${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters`,
    data,
    authHeaders(token),
  );

export const getChapterComments = (clubId, chapter) =>
  axios.get(`${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters/${chapter}/comments`);

export const postChapterComment = (clubId, chapter, text, token) =>
  axios.post(
    `${API_URL}/social/clubs/${encodeURIComponent(clubId)}/chapters/${chapter}/comments`,
    { text },
    authHeaders(token),
  );

export const getChapterMessages = getChapterComments;
export const postChapterMessage = postChapterComment;

/* ───────────── User Profile ───────────── */

export const getUserProfile = (token) => axios.get(`${API_URL}/users/profile`, authHeaders(token));

export const updateUserProfile = (profileData, token) =>
  axios.put(`${API_URL}/users/profile`, profileData, authHeaders(token));

export const updateUserAvatar = (avatarUrl, token) =>
  axios.put(`${API_URL}/users/avatar`, { avatar: avatarUrl }, authHeaders(token));

export const changePassword = (passwordData, token) =>
  axios.put(`${API_URL}/users/password`, passwordData, authHeaders(token));

export const deleteAccount = (token) =>
  axios.delete(`${API_URL}/users/account`, authHeaders(token));

/* ───────────── Reading Sessions API ───────────── */

export const startReadingSession = (sessionData, token) =>
  axios.post(`${API_URL}/reading-sessions/start`, sessionData, authHeaders(token));

export const updateReadingSession = (progressData, token) =>
  axios.put(`${API_URL}/reading-sessions/update`, progressData, authHeaders(token));

export const endReadingSession = (sessionData, token) =>
  axios.put(`${API_URL}/reading-sessions/end`, sessionData, authHeaders(token));

export const getActiveReadingSession = (bookId, token) => {
  return axios.get(
    `${API_URL}/reading-sessions/active/${encodeURIComponent(bookId)}`,
    authHeaders(token),
  );
};

export const getUserReadingSessions = (token) =>
  axios.get(`${API_URL}/reading-sessions/history`, authHeaders(token));

/* ───────────── Gamification API ───────────── */

export const getUserStats = (userId, token) =>
  axios.get(`${API_URL}/gamification/stats/user/${userId}`, authHeaders(token));

export const getUserAchievements = (userId, token) =>
  axios.get(`${API_URL}/gamification/achievements/user/${userId}`, authHeaders(token));

export const getAllAchievements = (token) =>
  axios.get(`${API_URL}/gamification/achievements`, authHeaders(token));

export const updateReadingProgress = (progressData, token) =>
  axios.post(`${API_URL}/gamification/reading/progress`, progressData, authHeaders(token));

export const getReadingChallenge = (userId, year, token) =>
  axios.get(`${API_URL}/gamification/challenge/user/${userId}/${year}`, authHeaders(token));

export const setReadingChallenge = (challengeData, token) =>
  axios.post(`${API_URL}/gamification/challenge`, challengeData, authHeaders(token));
