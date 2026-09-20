import React from 'react';
import { Film, Compass } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { MovieGridSkeleton } from './LoadingSkeleton';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  showRank?: boolean;
  onResetFilters?: () => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  emptyTitle = 'No movies discovered',
  emptyMessage = 'Try adjusting your filters, selecting a different genre, or searching for another title.',
  showRank = false,
  onResetFilters
}) => {
  if (loading) {
    return <MovieGridSkeleton count={12} />;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#12141d]/70 p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <Film className="w-8 h-8 text-amber-500/70" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{emptyTitle}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            <Compass className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie, index) => (
        <MovieCard
          key={`${movie.id}-${index}`}
          movie={movie}
          rank={showRank ? index + 1 : undefined}
        />
      ))}
    </div>
  );
};
