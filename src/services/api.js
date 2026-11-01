import { MOCK_ITEMS, GENRES_LIST, TMDB_IMAGE_BASE } from '../data/mockData';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_API_KEY = 'bb95a32b21703f8e56baec11c251d7c4'; // Public demo TMDB key for instant catalog access

export const getStoredApiKey = () => {
  return localStorage.getItem('superflix_tmdb_key') || import.meta.env.VITE_TMDB_API_KEY || DEFAULT_API_KEY;
};

export const setStoredApiKey = (key) => {
  if (!key) {
    localStorage.removeItem('superflix_tmdb_key');
  } else {
    localStorage.setItem('superflix_tmdb_key', key.trim());
  }
};

export const getStoredServer = () => {
  return localStorage.getItem('superflix_server_url') || 'server1';
};

export const setStoredServer = (server) => {
  localStorage.setItem('superflix_server_url', server);
};

export const SERVERS = [
  {
    id: 'server1',
    name: 'SuperFlix (Principal)',
    description: 'Servidor oficial superflixapi.fun (Dublado & Legendado)'
  },
  {
    id: 'server2',
    name: 'SuperFlix (Espelho .top)',
    description: 'Servidor espelho superflixapi.top'
  },
  {
    id: 'server3',
    name: 'SuperFlix (Espelho .run)',
    description: 'Servidor espelho superflixapi.run'
  },
  {
    id: 'server4',
    name: 'WarezCDN Player',
    description: 'Reprodutor nacional alternativo de alta velocidade'
  },
  {
    id: 'server5',
    name: 'Embedder Multi-Audio',
    description: 'Suporte a múltiplos idiomas e legendas'
  },
  {
    id: 'server6',
    name: 'VidSrc Player HD',
    description: 'Player internacional de contingência'
  }
];

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getPlayerUrl = (item, season = 1, episode = 1, serverId = null) => {
  const chosenServerId = serverId || getStoredServer();
  const isMovie = item.type === 'movie';
  const id = item.id;

  // 1. SuperFlix Principal (superflixapi.fun)
  // Formato oficial: https://superflixapi.fun/filme/{id} ou https://superflixapi.fun/serie/{id}/{temp}/{ep}
  if (chosenServerId === 'server1') {
    return isMovie
      ? `https://superflixapi.fun/filme/${id}`
      : `https://superflixapi.fun/serie/${id}/${season}/${episode}`;
  }

  // 2. SuperFlix Espelho (.top)
  if (chosenServerId === 'server2') {
    return isMovie
      ? `https://superflixapi.top/filme/${id}`
      : `https://superflixapi.top/serie/${id}/${season}/${episode}`;
  }

  // 3. SuperFlix Espelho (.run)
  if (chosenServerId === 'server3') {
    return isMovie
      ? `https://superflixapi.run/filme/${id}`
      : `https://superflixapi.run/serie/${id}/${season}/${episode}`;
  }

  // 4. WarezCDN Player
  if (chosenServerId === 'server4') {
    return isMovie
      ? `https://embed.warezcdn.link/filme/${id}`
      : `https://embed.warezcdn.link/serie/${id}/${season}/${episode}`;
  }

  // 5. Embedder
  if (chosenServerId === 'server5') {
    return isMovie
      ? `https://embedder.net/e/movie?tmdb=${id}`
      : `https://embedder.net/e/series?tmdb=${id}&sea=${season}&epi=${episode}`;
  }

  // 6. VidSrc
  if (chosenServerId === 'server6') {
    return isMovie
      ? `https://vidsrc.cc/v2/embed/movie/${id}`
      : `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`;
  }

  // Default fallback: SuperFlix Principal
  return isMovie
    ? `https://superflixapi.fun/filme/${id}`
    : `https://superflixapi.fun/serie/${id}/${season}/${episode}`;
};

// Safe TMDB fetch with fallback to MOCK_ITEMS
async function fetchFromTmdb(endpoint, params = {}) {
  const apiKey = getStoredApiKey();
  const searchParams = new URLSearchParams({
    api_key: apiKey,
    language: 'pt-BR',
    include_adult: 'false',
    ...params
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`TMDB HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    return null;
  }
}

// Convert TMDB item to unified schema
export function formatTmdbItem(item, overrideType = null, overrideCategory = null) {
  const type = overrideType || (item.title ? 'movie' : 'tv');
  const isMovie = type === 'movie';

  // Determine category
  let category = overrideCategory;
  if (!category) {
    const genreIds = item.genre_ids || (item.genres ? item.genres.map(g => g.id) : []);
    const isAnimation = genreIds.includes(16);
    const isJapanese = item.original_language === 'ja';

    if (isAnimation && isJapanese) {
      category = 'anime';
    } else if (isAnimation) {
      category = 'desenho';
    } else if (isMovie) {
      category = 'filme';
    } else {
      category = 'serie';
    }
  }

  const genreNames = item.genres
    ? item.genres.map(g => g.name)
    : (item.genre_ids || [])
        .map(id => GENRES_LIST.find(g => g.id === id)?.name)
        .filter(Boolean);

  const releaseDateStr = item.release_date || item.first_air_date || '2024';
  const releaseYear = parseInt(releaseDateStr.substring(0, 4), 10);
  const currentYear = new Date().getFullYear();
  const isUnreleased = releaseYear > currentYear;

  return {
    id: item.id,
    title: item.title || item.name || 'Sem Título',
    original_title: item.original_title || item.original_name || item.title || item.name,
    type,
    category,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    overview: item.overview || 'Sinopse não disponível em português.',
    vote_average: item.vote_average ? Number(item.vote_average.toFixed(1)) : 7.5,
    release_date: releaseDateStr,
    release_year: releaseYear,
    is_unreleased: isUnreleased,
    genres: genreNames.length > 0 ? genreNames : ['Entretenimento'],
    duration: isMovie ? '2h' : (item.number_of_seasons ? `${item.number_of_seasons} Temp.` : '1 Temp.'),
    age_rating: item.adult ? '18+' : '14+',
    seasons_count: item.number_of_seasons || 1,
    episodes_per_season: item.number_of_episodes ? Math.ceil(item.number_of_episodes / (item.number_of_seasons || 1)) : 10
  };
}

// Category & Section Getters
export const api = {
  // 1. Trending / Destaques
  async getTrending() {
    const data = await fetchFromTmdb('/trending/all/day');
    if (data && data.results && data.results.length > 0) {
      return data.results.map(item => formatTmdbItem(item));
    }
    return MOCK_ITEMS.filter(item => item.featured);
  },

  // 2. Popular Movies
  async getPopularMovies() {
    const data = await fetchFromTmdb('/movie/popular');
    if (data && data.results && data.results.length > 0) {
      return data.results.map(item => formatTmdbItem(item, 'movie', 'filme'));
    }
    return MOCK_ITEMS.filter(item => item.category === 'filme');
  },

  // 3. Popular Series
  async getPopularSeries() {
    const data = await fetchFromTmdb('/tv/popular');
    if (data && data.results && data.results.length > 0) {
      const nonAnime = data.results.filter(item => !(item.genre_ids || []).includes(16));
      return nonAnime.map(item => formatTmdbItem(item, 'tv', 'serie'));
    }
    return MOCK_ITEMS.filter(item => item.category === 'serie');
  },

  // 4. Popular Animes (Japanese Animation)
  async getPopularAnimes() {
    const data = await fetchFromTmdb('/discover/tv', {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc'
    });
    if (data && data.results && data.results.length > 0) {
      return data.results.map(item => formatTmdbItem(item, 'tv', 'anime'));
    }
    return MOCK_ITEMS.filter(item => item.category === 'anime');
  },

  // 5. Popular Cartoons / Desenhos (Non-Japanese animation or family)
  async getPopularCartoons() {
    const data = await fetchFromTmdb('/discover/movie', {
      with_genres: '16',
      without_original_language: 'ja',
      sort_by: 'popularity.desc'
    });
    if (data && data.results && data.results.length > 0) {
      return data.results.map(item => formatTmdbItem(item, 'movie', 'desenho'));
    }
    return MOCK_ITEMS.filter(item => item.category === 'desenho');
  },

  // 6. Top Rated
  async getTopRated() {
    const data = await fetchFromTmdb('/movie/top_rated');
    if (data && data.results && data.results.length > 0) {
      return data.results.map(item => formatTmdbItem(item, 'movie'));
    }
    return [...MOCK_ITEMS].sort((a, b) => b.vote_average - a.vote_average);
  },

  // 7. Lançamentos
  async getNewReleases() {
    const data = await fetchFromTmdb('/movie/now_playing');
    if (data && data.results && data.results.length > 0) {
      return data.results.map(item => formatTmdbItem(item, 'movie', 'filme'));
    }
    return [...MOCK_ITEMS].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  },

  // 8. Full Details with Seasons / Cast
  async getItemDetails(id, type = 'movie') {
    const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
    const data = await fetchFromTmdb(endpoint, {
      append_to_response: 'credits,similar,videos'
    });

    if (data) {
      const formatted = formatTmdbItem(data, type);
      formatted.cast = data.credits?.cast?.slice(0, 10).map(c => c.name) || [];
      formatted.director = data.credits?.crew?.find(c => c.job === 'Director')?.name || 'Não informado';
      formatted.seasons_count = data.number_of_seasons || 1;
      formatted.seasons = data.seasons || [];
      formatted.status = data.status || '';
      formatted.similar = data.similar?.results?.slice(0, 10).map(s => formatTmdbItem(s, type)) || [];
      formatted.trailer = data.videos?.results?.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))?.key;
      return formatted;
    }

    const found = MOCK_ITEMS.find(m => m.id === Number(id));
    if (found) {
      return {
        ...found,
        cast: ['Ator Principal', 'Co-protagonista', 'Coadjuvante'],
        director: 'Diretor Renomado',
        similar: MOCK_ITEMS.filter(m => m.category === found.category && m.id !== found.id).slice(0, 6)
      };
    }
    return null;
  },

  // 9. Fetch specific season episodes
  async getSeasonEpisodes(seriesId, seasonNumber = 1) {
    const data = await fetchFromTmdb(`/tv/${seriesId}/season/${seasonNumber}`);
    if (data && data.episodes) {
      return data.episodes.map(ep => ({
        id: ep.id,
        episode_number: ep.episode_number,
        name: ep.name,
        overview: ep.overview || 'Sinopse não cadastrada.',
        still_path: ep.still_path,
        vote_average: ep.vote_average ? ep.vote_average.toFixed(1) : null
      }));
    }

    // Generate mock episodes for realistic preview
    const count = 10;
    return Array.from({ length: count }, (_, i) => ({
      id: `${seriesId}-${seasonNumber}-${i + 1}`,
      episode_number: i + 1,
      name: `Episódio ${i + 1}`,
      overview: `Acompanhe os acontecimentos emocionantes do episódio ${i + 1} desta temporada.`,
      still_path: null,
      vote_average: '8.2'
    }));
  },

  // 10. Multi Search with filters
  async searchCatalog({ query, category = 'all', genre = 'all', sortBy = 'popularity' }) {
    let results = [];

    if (query && query.trim().length > 0) {
      const data = await fetchFromTmdb('/search/multi', { query: query.trim() });
      if (data && data.results && data.results.length > 0) {
        results = data.results
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          .map(item => formatTmdbItem(item, item.media_type));
      } else {
        const q = query.toLowerCase();
        results = MOCK_ITEMS.filter(item =>
          item.title.toLowerCase().includes(q) ||
          item.original_title.toLowerCase().includes(q) ||
          item.overview.toLowerCase().includes(q) ||
          item.genres.some(g => g.toLowerCase().includes(q))
        );
      }
    } else {
      if (category === 'filme') {
        results = await this.getPopularMovies();
      } else if (category === 'serie') {
        results = await this.getPopularSeries();
      } else if (category === 'anime') {
        results = await this.getPopularAnimes();
      } else if (category === 'desenho') {
        results = await this.getPopularCartoons();
      } else {
        results = [...MOCK_ITEMS];
      }
    }

    if (category !== 'all') {
      results = results.filter(item => item.category === category);
    }

    if (genre !== 'all') {
      results = results.filter(item =>
        item.genres && item.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      );
    }

    if (sortBy === 'rating') {
      results.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'recent') {
      results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  }
};
