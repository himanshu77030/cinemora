import { useState, useEffect } from 'react';
import { Movie, TimeWindow, FilterOptions } from '../types';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getBestMoviesOfYear,
  getMoviesByGenre,
  getMoviesByYear,
  searchMovies
} from '../services/tmdb';

export function useTrending(timeWindow: TimeWindow = 'day') {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTrendingMovies(timeWindow)
      .then(res => {
        if (mounted) {
          setMovies(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || 'Failed to fetch trending movies');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [timeWindow]);

  return { movies, loading, error };
}

export function useDiscoverCategory(category: 'popular' | 'topRated' | 'nowPlaying' | 'upcoming' | 'bestYear', year?: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const promise = (() => {
      switch (category) {
        case 'popular':
          return getPopularMovies(1);
        case 'topRated':
          return getTopRatedMovies(1);
        case 'nowPlaying':
          return getNowPlayingMovies(1);
        case 'upcoming':
          return getUpcomingMovies(1);
        case 'bestYear':
          return getBestMoviesOfYear(year || new Date().getFullYear(), 1);
        default:
          return getPopularMovies(1);
      }
    })();

    promise
      .then(res => {
        if (mounted) {
          setMovies(res.results);
          setTotalPages(res.totalPages);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || 'Failed to fetch movies');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [category, year]);

  return { movies, loading, totalPages, error };
}
