import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, FilterOptions } from '../types';
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies
} from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { FilterBar } from '../components/FilterBar';
import { setDocumentTitle } from '../utils/seo';

export const Movies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('category') || 'popular';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const [filters, setFilters] = useState<FilterOptions>({
    genreId: searchParams.get('genre') ? Number(searchParams.get('genre')) : undefined,
    year: searchParams.get('year') || undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    language: searchParams.get('lang') || undefined,
    sortBy: searchParams.get('sort') || 'popularity.desc'
  });

  const categories = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'top_rated', label: 'Top Rated' },
    { id: 'now_playing', label: 'In Theaters' },
    { id: 'upcoming', label: 'Upcoming' }
  ];

  useEffect(() => {
    setDocumentTitle(
      'Explore All Movies | Cinemora',
      'Discover and filter thousands of movies by genre, release year, rating, and popularity on Cinemora.'
    );

    let isMounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // If user has applied special filters (genre, year, minRating), use searchMovies discovery
        const hasCustomFilters = Boolean(
          filters.genreId || filters.year || (filters.minRating && filters.minRating > 0) || filters.language
        );

        if (hasCustomFilters) {
          const res = await searchMovies('', page, filters);
          if (isMounted) {
            setMovies(res.results);
            setTotalPages(res.totalPages);
            setTotalCount(res.totalResults);
          }
        } else {
          // Standard categories
          let res: { results: Movie[]; totalPages: number };
          if (activeTab === 'top_rated') {
            res = await getTopRatedMovies(page);
          } else if (activeTab === 'now_playing') {
            res = await getNowPlayingMovies(page);
          } else if (activeTab === 'upcoming') {
            res = await getUpcomingMovies(page);
          } else {
            res = await getPopularMovies(page);
          }

          if (isMounted) {
            setMovies(res.results);
            setTotalPages(res.totalPages);
            setTotalCount(undefined);
          }
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, [activeTab, page, filters]);

  const handleTabChange = (category: string) => {
    setPage(1);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('category', category);
      return next;
    });
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setPage(1);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      genreId: undefined,
      year: undefined,
      minRating: undefined,
      language: undefined,
      sortBy: 'popularity.desc'
    });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold mb-1">
            <Compass className="w-4 h-4" />
            <span>Movie Discovery Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Explore Movies
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse through theatrical debuts, streaming favorites, and timeless classics
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === cat.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Movie Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:hover:bg-white/5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs sm:text-sm font-semibold text-amber-400">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:hover:bg-white/5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-1 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
