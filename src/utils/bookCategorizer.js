const GENRE_KEYWORDS = {
  romance: {
    keywords: [
      'romance',
      'romántico',
      'romántica',
      'love story',
      'historia de amor',
      'passion',
      'pasión',
      'kiss',
      'beso',
      'wedding',
      'boda',
      'marriage',
      'matrimonio',
      'relationship',
      'relación',
      'couple',
      'pareja',
      'dating',
      'citas',
      'valentine',
      'san valentín',
      'heartbreak',
      'desamor',
      'affair',
      'aventura',
    ],
    mood: 'light',
  },
  mystery: {
    keywords: [
      'mystery',
      'misterio',
      'murder',
      'asesinato',
      'crime',
      'crimen',
      'detective',
      'detective',
      'investigation',
      'investigación',
      'clue',
      'pista',
      'suspense',
      'suspenso',
      'secret',
      'secreto',
      'conspiracy',
      'conspiración',
      'whodunit',
      'enigma',
      'puzzle',
      'rompecabezas',
      'mysterious',
      'misterioso',
    ],
    mood: 'dark',
  },
  'sci-fi': {
    keywords: [
      'sci-fi',
      'science fiction',
      'ciencia ficción',
      'space',
      'espacio',
      'future',
      'futuro',
      'robot',
      'robot',
      'alien',
      'alienígena',
      'technology',
      'tecnología',
      'galaxy',
      'galaxia',
      'planet',
      'planeta',
      'time travel',
      'viaje temporal',
      'cyberpunk',
      'dystopia',
      'distopía',
      'apocalypse',
      'apocalipsis',
      'spaceship',
      'nave espacial',
      'artificial intelligence',
      'inteligencia artificial',
    ],
    mood: 'reflective',
  },
  fantasy: {
    keywords: [
      'fantasy',
      'fantasía',
      'magic',
      'magia',
      'dragon',
      'dragón',
      'wizard',
      'hechicero',
      'witch',
      'bruja',
      'fairy',
      'hada',
      'kingdom',
      'reino',
      'castle',
      'castillo',
      'sword',
      'espada',
      'quest',
      'búsqueda',
      'adventure',
      'aventura',
      'mythology',
      'mitología',
      'hobbit',
      'elf',
      'elfo',
      'dwarf',
      'enano',
      'orc',
      'orco',
      'middle-earth',
      'tierra media',
      'tolkien',
      'magical',
      'mágico',
    ],
    mood: 'fun',
  },
  thriller: {
    keywords: [
      'thriller',
      'suspense',
      'suspenso',
      'horror',
      'terror',
      'fear',
      'miedo',
      'scary',
      'aterrador',
      'nightmare',
      'pesadilla',
      'ghost',
      'fantasma',
      'haunted',
      'embrujado',
      'supernatural',
      'sobrenatural',
      'paranormal',
      'psychological',
      'psicológico',
      'tension',
      'tensión',
      'danger',
      'peligro',
    ],
    mood: 'dark',
  },
  fiction: {
    keywords: [
      'novel',
      'novela',
      'story',
      'historia',
      'tale',
      'cuento',
      'narrative',
      'narrativa',
      'literature',
      'literatura',
      'classic',
      'clásico',
      'contemporary',
      'contemporáneo',
      'drama',
      'drama',
      'family',
      'familia',
      'coming of age',
      'madurez',
      'life',
      'vida',
      'human',
      'humano',
    ],
    mood: 'reflective',
  },
};

const MOOD_KEYWORDS = {
  light: [
    'happy',
    'feliz',
    'joy',
    'alegría',
    'fun',
    'divertido',
    'comedy',
    'comedia',
    'humor',
    'humor',
    'cheerful',
    'alegre',
    'bright',
    'brillante',
    'sunny',
    'soleado',
  ],
  reflective: [
    'deep',
    'profundo',
    'thoughtful',
    'reflexivo',
    'philosophical',
    'filosófico',
    'contemplative',
    'contemplativo',
    'meditative',
    'meditativo',
    'introspective',
    'introspectivo',
  ],
  dark: [
    'dark',
    'oscuro',
    'sad',
    'triste',
    'melancholy',
    'melancolía',
    'gloomy',
    'sombrío',
    'depressing',
    'deprimente',
    'tragic',
    'trágico',
    'bleak',
    'desolador',
  ],
  fun: [
    'funny',
    'gracioso',
    'hilarious',
    'divertidísimo',
    'entertaining',
    'entretenido',
    'amusing',
    'divertido',
    'witty',
    'ingenioso',
    'playful',
    'juguetón',
  ],
};

const DEFAULT_CATEGORIZATION = {
  genre: 'fiction',
  mood: 'reflective',
};

const SPECIFIC_BOOK_KEYWORDS = {
  hobbit: 'fantasy',
  'lord of the rings': 'fantasy',
  tolkien: 'fantasy',
  'harry potter': 'fantasy',
  'game of thrones': 'fantasy',
  'pride and prejudice': 'romance',
  'jane austen': 'romance',
  'romeo and juliet': 'romance',
  1984: 'sci-fi',
  'george orwell': 'sci-fi',
  dune: 'sci-fi',
  'frank herbert': 'sci-fi',
  'sherlock holmes': 'mystery',
  'arthur conan doyle': 'mystery',
  'agatha christie': 'mystery',
  'stephen king': 'thriller',
  dracula: 'thriller',
  'bram stoker': 'thriller',
};

/**
 * Normaliza el texto para búsqueda (minúsculas, sin acentos)
 * @param {string} text - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
const normalizeText = (text) => {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Combina múltiples campos de texto en uno solo
 * @param {Object} book - Objeto del libro
 * @returns {string} - Texto combinado y normalizado
 */
const combineBookText = (book) => {
  const fields = [book.title, book.author, book.description, book.subtitle, book.publisher].filter(
    Boolean,
  );

  return fields.map(normalizeText).join(' ');
};

/**
 * Busca palabras clave en el texto
 * @param {string} text - Texto donde buscar
 * @param {Array} keywords - Array de palabras clave
 * @returns {boolean} - True si encuentra alguna palabra clave
 */
const hasKeywords = (text, keywords) => {
  return keywords.some((keyword) => text.includes(keyword));
};

/**
 * Calcula la puntuación de coincidencia para un género
 * @param {string} text - Texto del libro
 * @param {Array} keywords - Palabras clave del género
 * @returns {number} - Puntuación de coincidencia
 */
const calculateGenreScore = (text, keywords) => {
  return keywords.reduce((score, keyword) => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return score + (regex.test(text) ? 1 : 0);
  }, 0);
};

/**
 * Determina el género basado en la puntuación más alta
 * @param {string} text - Texto del libro
 * @returns {string} - ID del género
 */
const determineGenre = (text) => {
  for (const [bookKeyword, genre] of Object.entries(SPECIFIC_BOOK_KEYWORDS)) {
    if (text.includes(bookKeyword.toLowerCase())) {
      return genre;
    }
  }

  let bestGenre = DEFAULT_CATEGORIZATION.genre;
  let highestScore = 0;

  Object.entries(GENRE_KEYWORDS).forEach(([genreId, config]) => {
    const score = calculateGenreScore(text, config.keywords);
    if (score > highestScore) {
      highestScore = score;
      bestGenre = genreId;
    }
  });

  if (highestScore < 2 && bestGenre !== 'fiction') {
    return DEFAULT_CATEGORIZATION.genre;
  }

  return bestGenre;
};

/**
 * Determina el mood basado en palabras clave específicas
 * @param {string} text - Texto del libro
 * @param {string} genreMood - Mood por defecto del género
 * @returns {string} - ID del mood
 */
const determineMood = (text, genreMood) => {
  for (const [moodId, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (hasKeywords(text, keywords)) {
      return moodId;
    }
  }

  return genreMood;
};

/**
 * Categoriza un libro basándose en su título, autor y descripción
 * @param {Object} book - Objeto del libro con title, author, description
 * @returns {Object} - Objeto con genre y mood
 */
export const categorizeBook = (book) => {
  try {
    if (!book || typeof book !== 'object') {
      return DEFAULT_CATEGORIZATION;
    }

    const combinedText = combineBookText(book);

    if (!combinedText) {
      return DEFAULT_CATEGORIZATION;
    }

    const genreId = determineGenre(combinedText);
    const genreMood = GENRE_KEYWORDS[genreId]?.mood || DEFAULT_CATEGORIZATION.mood;

    const moodId = determineMood(combinedText, genreMood);

    return {
      genre: genreId,
      mood: moodId,
    };
  } catch (error) {
    return DEFAULT_CATEGORIZATION;
  }
};

/**
 * Categoriza múltiples libros de una vez
 * @param {Array} books - Array de libros
 * @returns {Array} - Array de libros con genre y mood agregados
 */
export const categorizeBooks = (books) => {
  if (!Array.isArray(books)) {
    return [];
  }

  return books.map((book) => ({
    ...book,
    ...categorizeBook(book),
  }));
};

export default categorizeBook;
