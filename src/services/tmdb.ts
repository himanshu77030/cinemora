import { Movie, MovieCredits, MovieVideo, TrendingActor, FilterOptions, TimeWindow } from '../types';
import { CURATED_MOVIES, MOCK_CREDITS, MOCK_VIDEOS, TRENDING_ACTORS } from '../data/mockMovies';
import { TMDB_GENRES } from '../data/genres';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// In-memory cache for fast snappy navigation
const apiCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const getApiKey = (): string => {
  const customKey = localStorage.getItem('cinemora_tmdb_key');
  if (customKey && customKey.trim()) {
    return customKey.trim();
  }
  return (import.meta.env.VITE_TMDB_API_KEY as string) || '';
};

export const setCustomApiKey = (key: string) => {
  if (key.trim()) {
    localStorage.setItem('cinemora_tmdb_key', key.trim());
  } else {
    localStorage.removeItem('cinemora_tmdb_key');
  }
  apiCache.clear();
};

export const hasApiKey = (): boolean => {
  return Boolean(getApiKey());
};

export const getImageUrl = (path: string | null | undefined, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1280&auto=format&fit=crop';
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('include_adult', 'false');

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });

  const cacheKey = url.toString();
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.warn(`TMDB API request failed with status: ${response.status}`);
      return null;
    }
    const data = await response.json();
    apiCache.set(cacheKey, { timestamp: Date.now(), data });
    return data as T;
  } catch (err) {
    console.error('TMDB Network error:', err);
    return null;
  }
}

// 1. Trending Movies
export async function getTrendingMovies(timeWindow: TimeWindow = 'day'): Promise<Movie[]> {
  const res = await fetchFromTMDB<{ results: Movie[] }>(`/trending/movie/${timeWindow}`);
  if (res && res.results && res.results.length > 0) {
    return res.results;
  }
  // Fallback sorted by popularity / recency
  if (timeWindow === 'day') {
    return [...CURATED_MOVIES].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
  return [...CURATED_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
}

// 2. Popular Movies
export async function getPopularMovies(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
  const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(`/movie/popular`, { page });
  if (res && res.results && res.results.length > 0) {
    return { results: res.results, totalPages: Math.min(res.total_pages || 1, 50) };
  }
  return {
    results: [...CURATED_MOVIES].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)),
    totalPages: 2
  };
}

// 3. Top Rated Movies
export async function getTopRatedMovies(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
  const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(`/movie/top_rated`, { page });
  if (res && res.results && res.results.length > 0) {
    return { results: res.results, totalPages: Math.min(res.total_pages || 1, 50) };
  }
  return {
    results: [...CURATED_MOVIES].sort((a, b) => b.vote_average - a.vote_average),
    totalPages: 2
  };
}

// 4. Now Playing Movies
export async function getNowPlayingMovies(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
  const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(`/movie/now_playing`, { page });
  if (res && res.results && res.results.length > 0) {
    return { results: res.results, totalPages: Math.min(res.total_pages || 1, 50) };
  }
  return {
    results: CURATED_MOVIES.filter(m => m.release_date.startsWith('2024') || m.release_date.startsWith('2023')),
    totalPages: 1
  };
}

// 5. Upcoming Movies
export async function getUpcomingMovies(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
  const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(`/movie/upcoming`, { page });
  if (res && res.results && res.results.length > 0) {
    return { results: res.results, totalPages: Math.min(res.total_pages || 1, 50) };
  }
  return {
    results: CURATED_MOVIES.slice(0, 8).map(m => ({ ...m, release_date: '2025-11-20' })),
    totalPages: 1
  };
}

// 6. Best Movies of the Year
export async function getBestMoviesOfYear(year: number | string, page = 1, sortBy = 'vote_average.desc'): Promise<{ results: Movie[]; totalPages: number }> {
  const yearStr = String(year);
  const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(`/discover/movie`, {
    primary_release_year: yearStr,
    sort_by: sortBy,
    'vote_count.gte': '200',
    page
  });
  if (res && res.results && res.results.length > 0) {
    return { results: res.results, totalPages: Math.min(res.total_pages || 1, 30) };
  }
  const filtered = CURATED_MOVIES.filter(m => m.release_date.startsWith(yearStr));
  const results = filtered.length > 0 ? filtered : CURATED_MOVIES.slice(0, 10);
  return {
    results: [...results].sort((a, b) => b.vote_average - a.vote_average),
    totalPages: 1
  };
}

// 7. Movie Details
export async function getMovieDetails(id: number | string): Promise<Movie | null> {
  const numId = Number(id);
  const res = await fetchFromTMDB<Movie>(`/movie/${id}`);
  if (res && res.title) {
    return res;
  }
  const local = CURATED_MOVIES.find(m => m.id === numId);
  if (local) return local;

  // If ID not in curated, return first with matched or generated details
  return CURATED_MOVIES[0] || null;
}

// 8. Movie Credits
export async function getMovieCredits(id: number | string): Promise<MovieCredits> {
  const numId = Number(id);
  const res = await fetchFromTMDB<MovieCredits>(`/movie/${id}/credits`);
  if (res && res.cast && res.cast.length > 0) {
    return res;
  }
  if (MOCK_CREDITS[numId]) {
    return MOCK_CREDITS[numId];
  }
  // Generic fallback cast
  return {
    id: numId,
    cast: [
      { id: 101, name: 'Leading Performer', character: 'Protagonist', profile_path: null, known_for_department: 'Acting', popularity: 85 },
      { id: 102, name: 'Supporting Star', character: 'Deuteragonist', profile_path: null, known_for_department: 'Acting', popularity: 75 },
      { id: 103, name: 'Guest Appearance', character: 'Allied Friend', profile_path: null, known_for_department: 'Acting', popularity: 70 }
    ],
    crew: [
      { id: 201, name: 'Visionary Director', job: 'Director', department: 'Directing', profile_path: null },
      { id: 202, name: 'Screenplay Author', job: 'Writer', department: 'Writing', profile_path: null }
    ]
  };
}

// 9. Movie Videos (Trailers)
export async function getMovieVideos(id: number | string): Promise<MovieVideo[]> {
  const numId = Number(id);
  const res = await fetchFromTMDB<{ results: MovieVideo[] }>(`/movie/${id}/videos`);
  if (res && res.results && res.results.length > 0) {
    return res.results;
  }
  if (MOCK_VIDEOS[numId]) {
    return MOCK_VIDEOS[numId];
  }
  return [
    {
      id: 'default-trailer',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: 'Way9Dexny3w',
      name: 'Featured Theatrical Trailer',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2024-01-01T00:00:00.000Z'
    }
  ];
}

// 10. Similar Movies
export async function getSimilarMovies(id: number | string): Promise<Movie[]> {
  const numId = Number(id);
  const res = await fetchFromTMDB<{ results: Movie[] }>(`/movie/${id}/similar`);
  if (res && res.results && res.results.length > 0) {
    return res.results;
  }
  return CURATED_MOVIES.filter(m => m.id !== numId).slice(0, 8);
}

// 11. Recommended Movies
export async function getRecommendedMovies(id: number | string): Promise<Movie[]> {
  const numId = Number(id);
  const res = await fetchFromTMDB<{ results: Movie[] }>(`/movie/${id}/recommendations`);
  if (res && res.results && res.results.length > 0) {
    return res.results;
  }
  return [...CURATED_MOVIES].reverse().filter(m => m.id !== numId).slice(0, 8);
}

// 12. Search Movies with Multi-Filter
export async function searchMovies(
  query: string,
  page = 1,
  options: FilterOptions = {}
): Promise<{ results: Movie[]; totalPages: number; totalResults: number }> {
  const apiKey = getApiKey();
  const trimmed = query.trim();

  if (apiKey && trimmed) {
    const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number; total_results: number }>(`/search/movie`, {
      query: trimmed,
      page,
      year: options.year
    });
    if (res && res.results) {
      let filtered = res.results;
      if (options.genreId) {
        filtered = filtered.filter(m => m.genre_ids?.includes(Number(options.genreId)));
      }
      if (options.minRating) {
        filtered = filtered.filter(m => m.vote_average >= (options.minRating || 0));
      }
      return {
        results: filtered,
        totalPages: res.total_pages || 1,
        totalResults: res.total_results || filtered.length
      };
    }
  }

  // Fallback internal search across movie title, overview, cast, directors
  let matches = CURATED_MOVIES.filter(m => {
    const titleMatch = m.title.toLowerCase().includes(trimmed.toLowerCase());
    const overviewMatch = m.overview.toLowerCase().includes(trimmed.toLowerCase());
    const credits = MOCK_CREDITS[m.id];
    const castMatch = credits?.cast.some(c => c.name.toLowerCase().includes(trimmed.toLowerCase()));
    const crewMatch = credits?.crew.some(c => c.name.toLowerCase().includes(trimmed.toLowerCase()));

    return !trimmed || titleMatch || overviewMatch || castMatch || crewMatch;
  });

  if (options.genreId) {
    matches = matches.filter(m => m.genre_ids?.includes(Number(options.genreId)));
  }
  if (options.year) {
    matches = matches.filter(m => m.release_date.startsWith(options.year!));
  }
  if (options.minRating) {
    matches = matches.filter(m => m.vote_average >= (options.minRating || 0));
  }
  if (options.sortBy) {
    if (options.sortBy === 'vote_average.desc') {
      matches.sort((a, b) => b.vote_average - a.vote_average);
    } else if (options.sortBy === 'primary_release_date.desc') {
      matches.sort((a, b) => b.release_date.localeCompare(a.release_date));
    } else if (options.sortBy === 'title.asc') {
      matches.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      matches.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
  }

  return {
    results: matches,
    totalPages: 1,
    totalResults: matches.length
  };
}

// 13. Movies by Genre
export async function getMoviesByGenre(
  genreId: number | string,
  page = 1,
  sortBy = 'popularity.desc',
  year?: string
): Promise<{ results: Movie[]; totalPages: number }> {
  const gId = Number(genreId);
  const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(`/discover/movie`, {
    with_genres: gId,
    sort_by: sortBy,
    primary_release_year: year,
    page
  });
  if (res && res.results && res.results.length > 0) {
    return { results: res.results, totalPages: Math.min(res.total_pages || 1, 40) };
  }

  let filtered = CURATED_MOVIES.filter(m => m.genre_ids?.includes(gId));
  if (filtered.length === 0) {
    // If few, supplement with related movies
    filtered = CURATED_MOVIES.slice(0, 6);
  }
  if (year) {
    filtered = filtered.filter(m => m.release_date.startsWith(year));
  }
  if (sortBy === 'vote_average.desc') {
    filtered.sort((a, b) => b.vote_average - a.vote_average);
  } else {
    filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
  return { results: filtered, totalPages: 1 };
}

// 14. Movies by Year
export async function getMoviesByYear(
  year: number | string,
  page = 1,
  sortBy = 'popularity.desc'
): Promise<{ results: Movie[]; totalPages: number }> {
  const yearStr = String(year);
  const res = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(`/discover/movie`, {
    primary_release_year: yearStr,
    sort_by: sortBy,
    page
  });
  if (res && res.results && res.results.length > 0) {
    return { results: res.results, totalPages: Math.min(res.total_pages || 1, 40) };
  }
  const filtered = CURATED_MOVIES.filter(m => m.release_date.startsWith(yearStr));
  const results = filtered.length > 0 ? filtered : CURATED_MOVIES.slice(0, 8);
  return { results, totalPages: 1 };
}

// 15. Trending Actors
export async function getTrendingActors(): Promise<TrendingActor[]> {
  const res = await fetchFromTMDB<{ results: TrendingActor[] }>(`/trending/person/week`);
  if (res && res.results && res.results.length > 0) {
    return res.results;
  }
  return TRENDING_ACTORS;
}
