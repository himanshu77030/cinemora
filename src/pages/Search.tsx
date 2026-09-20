import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, FilterOptions } from '../types';
import { searchMovies } from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { FilterBar } from '../components/FilterBar';
import { setDocumentTitle } from '../utils/seo';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState<FilterOptions>({
    genreId: searchParams.get('genre') ? Number(searchParams.get('genre')) : undefined,
    year: searchParams.get('year') || undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    language: searchParams.get('lang') || undefined,
    sortBy: searchParams.get('sort') || 'popularity.desc'
  });

  // Sync state if URL query changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchTerm(q);
  }, [searchParams]);

  useEffect(() => {
    const queryDisplay = searchTerm.trim() ? `Search: "${searchTerm}"` : 'Movie Search';
    setDocumentTitle(
      `${queryDisplay} | Cinemora`,
      `Find movies matching ${searchTerm || 'your favorite titles, actors, and genres'} on Cinemora.`
    );

    let isMounted = true;
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await searchMovies(searchTerm, page, filters);
        if (isMounted) {
          setMovies(res.results);
          setTotalPages(res.totalPages);
          setTotalResults(res.totalResults);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearchResults();
    return () => {
      isMounted = false;
    };
  }, [searchTerm, page, filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (searchTerm.trim()) {
        next.set('q', searchTerm.trim());
      } else {
        next.delete('q');
      }
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
      {/* Header with Search Input */}
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display flex items-center gap-3">
          <SearchIcon className="w-8 h-8 text-amber-400" />
          <span>Global Search</span>
        </h1>
        <p className="text-sm text-neutral-400">
          Search by movie title, leading cast members, directors, keywords, or release dates.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a movie title, actor, or genre..."
            className="w-full bg-[#12141f] border border-white/15 rounded-2xl py-3.5 pl-12 pr-28 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 text-sm sm:text-base shadow-xl"
          />
          <SearchIcon className="w-5 h-5 text-neutral-400 absolute left-4 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={totalResults}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-amber-400" />
          <span>
            {searchTerm.trim() ? (
              <>Results for <span className="text-amber-300 font-semibold">"{searchTerm}"</span></>
            ) : (
              'All Discovered Titles'
            )}
          </span>
        </h2>
        {totalPages > 1 && (
          <span className="text-xs text-neutral-400">
            Page {page} of {totalPages}
          </span>
        )}
      </div>

      {/* Movie Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        emptyTitle={searchTerm.trim() ? `No results found for "${searchTerm}"` : 'No titles discovered'}
        emptyMessage="Try broadening your search query, checking for typos, or clearing the genre/rating filters."
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
            {page} / {totalPages}
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
