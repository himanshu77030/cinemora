export interface Genre {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  backdrop?: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  original_language?: string;
  popularity?: number;
  production_companies?: ProductionCompany[];
  spoken_languages?: SpokenLanguage[];
}

export interface CastMember {
  id: number;
  name: string;
  original_name?: string;
  character: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity?: number;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TrendingActor {
  id: number;
  name: string;
  popularity: number;
  profile_path: string | null;
  known_for_department: string;
  known_for: Movie[];
}

export interface FilterOptions {
  genreId?: number | string;
  year?: string;
  decade?: string;
  sortBy?: string;
  minRating?: number;
  language?: string;
  searchQuery?: string;
}

export type TimeWindow = 'day' | 'week';

export interface WatchlistItem extends Movie {
  addedAt: number;
}

export type FreePlatformName =
  | 'YouTube'
  | 'Tubi'
  | 'Pluto TV'
  | 'Plex'
  | 'Internet Archive'
  | 'Freevee'
  | 'Netflix';

export interface FreeWatchSource {
  platform: FreePlatformName;
  url: string;
  type: 'Full Movie' | 'Free with Ads' | 'Public Domain' | 'Official Upload' | 'Free Preview';
  quality?: string;
  channelOrHost?: string;
  embedId?: string; // YouTube video ID or stream key if embeddable
}

export interface FreeMovie extends Movie {
  freeSources: FreeWatchSource[];
  isPublicDomain?: boolean;
  featuredFree?: boolean;
}

export interface WatchedHistoryItem {
  movie: Movie;
  watchedAt: number; // timestamp
}

export interface UserPreferences {
  favoriteGenres: number[];
  preferredPlatform: string;
  autoplayTrailers: boolean;
  emailNotifications: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'member' | 'vip' | 'admin';
  joinedDate: string;
  preferences: UserPreferences;
}

