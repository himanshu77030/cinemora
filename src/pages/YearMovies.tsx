import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, FilterOptions } from '../types';
import { getBestMoviesOfYear } from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { FilterBar } from '../components/FilterBar';
import { setDocumentTitle } from '../utils/seo';

export const YearMovies: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const currentSelectedYear = year || '2025';
  const numericYear = Number(currentSelectedYear);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<FilterOptions>({
    genreId: undefined,
    minRating: undefined,
    sortBy: 'vote_average.desc'
  });

  useEffect(() => {
    setDocumentTitle(
      `Best Movies of ${currentSelectedYear} | Cinemora`,
      `Discover the top rated, highest grossing, and most popular movie releases of ${currentSelectedYear} on Cinemora.`
    );

    let isMounted = true;
    setLoading(true);

    getBestMoviesOfYear(currentSelectedYear, page, filters.sortBy || 'vote_average.desc')
      .then((res) => {
        if (isMounted) {
          let list = res.results;
          if (filters.genreId) {
            list = list.filter((m) => m.genre_ids?.includes(Number(filters.genreId)));
          }
          if (filters.minRating) {
            list = list.filter((m) => m.vote_average >= (filters.minRating || 0));
          }
          setMovies(list);
          setTotalPages(res.totalPages);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentSelectedYear, page, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/years"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>All Years & Decades</span>
        </Link>

        {/* Adjacent Year Jumpers */}
        <div className="flex items-center gap-2">
          {numericYear > 1920 && (
            <Link
              to={`/year/${numericYear - 1}`}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 transition-colors"
            >
              ← {numericYear - 1}
            </Link>
          )}
          {numericYear < 2030 && (
            <Link
              to={`/year/${numericYear + 1}`}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 transition-colors"
            >
              {numericYear + 1} →
            </Link>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold">
          <Calendar className="w-4 h-4" />
          <span>Cinema Archive</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Best Movies of {currentSelectedYear}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          Ranked by critical reception, popularity, and community voter scores for the release year {currentSelectedYear}.
        </p>
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
          setFilters({ genreId: undefined, minRating: undefined, sortBy: 'vote_average.desc' });
        }}
      />

      {/* Movie Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        showRank
      />

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
