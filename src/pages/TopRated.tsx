import React, { useState, useEffect } from 'react';
import { Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, FilterOptions } from '../types';
import {
  getTopRatedMovies,
  getPopularMovies,
  getTrendingMovies,
  getBestMoviesOfYear
} from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { FilterBar } from '../components/FilterBar';
import { setDocumentTitle } from '../utils/seo';

export const TopRated: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'top_rated' | 'popular' | 'trending' | 'all_time' | 'this_year'>('top_rated');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<FilterOptions>({
    genreId: undefined,
    year: undefined,
    minRating: undefined,
    sortBy: 'vote_average.desc'
  });

  const categories = [
    { id: 'top_rated', label: 'Top Rated' },
    { id: 'all_time', label: 'Best of All Time' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'trending', label: 'Trending Leaders' },
    { id: 'this_year', label: 'Best This Year' }
  ];

  useEffect(() => {
    setDocumentTitle(
      'Top Movies & Highest Rated Cinema | Cinemora',
      'Explore the all-time greatest cinematic achievements, top rated movies, and fan-favorite masterworks.'
    );

    let isMounted = true;
    setLoading(true);

    const loadCategory = async () => {
      try {
        let res: { results: Movie[]; totalPages: number };
        const currentYear = new Date().getFullYear();

        if (activeCategory === 'popular') {
          res = await getPopularMovies(page);
        } else if (activeCategory === 'trending') {
          const list = await getTrendingMovies('week');
          res = { results: list, totalPages: 1 };
        } else if (activeCategory === 'this_year') {
          res = await getBestMoviesOfYear(currentYear, page, 'vote_average.desc');
        } else {
          // 'top_rated' or 'all_time'
          res = await getTopRatedMovies(page);
        }

        if (isMounted) {
          let list = res.results;
          if (filters.genreId) {
            list = list.filter((m) => m.genre_ids?.includes(Number(filters.genreId)));
          }
          if (filters.year) {
            list = list.filter((m) => m.release_date?.startsWith(filters.year!));
          }
          if (filters.minRating) {
            list = list.filter((m) => m.vote_average >= (filters.minRating || 0));
          }

          setMovies(list);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        console.error('Failed to load top movies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, page, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>Pinnacle of Cinema</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Top Movies
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            The definitive collection of cinema's most acclaimed, beloved, and iconic stories
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setPage(1);
                setActiveCategory(cat.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
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
        onFilterChange={(newF) => {
          setPage(1);
          setFilters((prev) => ({ ...prev, ...newF }));
        }}
        onReset={() => {
          setPage(1);
          setFilters({ genreId: undefined, year: undefined, minRating: undefined, sortBy: 'vote_average.desc' });
        }}
      />

      {/* Movie Grid */}
      <MovieGrid movies={movies} loading={loading} showRank />

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs sm:text-sm font-semibold text-amber-400">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-1 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
