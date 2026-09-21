import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'shimmer' | 'pulse' | 'static';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Universal primitive for building arbitrary skeleton elements with customizable shape and shimmer
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'shimmer',
  rounded = 'md',
  ...props
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };

  const variantClass =
    variant === 'shimmer'
      ? 'skeleton-shimmer'
      : variant === 'pulse'
      ? 'animate-pulse bg-white/10'
      : 'bg-white/5';

  return (
    <div
      className={`relative ${roundedClasses[rounded]} ${variantClass} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export interface MovieCardSkeletonProps {
  showRank?: boolean;
  className?: string;
  viewMode?: 'grid' | 'list';
}

/**
 * Reusable skeleton loader matching exact geometry and layout of MovieCard
 * Prevents cumulative layout shift (CLS) during movie data fetching.
 */
export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({
  showRank = false,
  className = '',
  viewMode = 'grid'
}) => {
  if (viewMode === 'list') {
    return (
      <div
        className={`flex items-center gap-4 p-3 rounded-2xl bg-[#151722] border border-white/5 overflow-hidden ${className}`}
        aria-busy="true"
        aria-label="Loading movie..."
      >
        {/* Poster Thumbnail */}
        <div className="w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden bg-[#181b28] skeleton-shimmer flex-shrink-0" />

        {/* Content Info */}
        <div className="flex-1 min-w-0 space-y-2.5 py-1">
          <div className="h-4 sm:h-5 bg-white/10 rounded w-2/3 skeleton-shimmer" />
          <div className="flex items-center gap-3">
            <div className="h-3 bg-white/10 rounded w-12 skeleton-shimmer" />
            <div className="h-4 bg-white/5 rounded-md w-16 border border-white/5 skeleton-shimmer" />
            <div className="h-4 bg-amber-500/15 rounded-md w-10 border border-amber-500/20 skeleton-shimmer" />
          </div>
          <div className="h-3 bg-white/5 rounded w-5/6 hidden sm:block skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-[#151722] border border-white/5 shadow-md flex flex-col justify-between ${className}`}
      aria-busy="true"
      aria-label="Loading movie..."
    >
      {/* Poster Image Area */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#181b28] skeleton-shimmer">
        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
          {showRank ? (
            /* Rank badge placeholder */
            <div className="h-6 w-9 rounded-md bg-amber-500/25 border border-amber-500/30 skeleton-shimmer shadow-sm" />
          ) : (
            /* Rating badge placeholder */
            <div className="h-5 w-12 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 px-2 skeleton-shimmer">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
              <div className="w-5 h-2 bg-white/20 rounded" />
            </div>
          )}

          {/* Watchlist button placeholder */}
          <div className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 skeleton-shimmer" />
        </div>

        {/* Ambient bottom shadow reflection placeholder */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#151722] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Info (Static below poster, matching MovieCard) */}
      <div className="p-3 space-y-2.5 bg-[#151722]">
        {/* Title placeholder */}
        <div className="h-4 bg-white/10 rounded w-4/5 skeleton-shimmer" />

        {/* Metadata bottom row: Year & Genre */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-white/10 skeleton-shimmer" />
            <div className="h-3 w-10 bg-white/10 rounded skeleton-shimmer" />
          </div>
          <div className="h-4 w-14 rounded bg-white/5 border border-white/5 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export interface MovieGridSkeletonProps {
  count?: number;
  columns?: string;
  showRank?: boolean;
  className?: string;
}

/**
 * Reusable movie grid skeleton layout for catalogs, search, genres, and top-rated pages
 */
export const MovieGridSkeleton: React.FC<MovieGridSkeletonProps> = ({
  count = 12,
  columns = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6',
  showRank = false,
  className = ''
}) => {
  return (
    <div
      className={`${columns} ${className}`}
      aria-busy="true"
      aria-label="Loading movies grid..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} showRank={showRank} />
      ))}
    </div>
  );
};

export interface MovieCarouselSkeletonProps {
  count?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * Horizontal movie carousel skeleton with responsive card sizing matching MovieCarousel
 */
export const MovieCarouselSkeleton: React.FC<MovieCarouselSkeletonProps> = ({
  count = 6,
  showHeader = false,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`} aria-busy="true" aria-label="Loading movie carousel...">
      {showHeader && (
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/10 rounded-lg skeleton-shimmer" />
            <div className="h-3.5 w-64 bg-white/5 rounded skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 skeleton-shimmer" />
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 skeleton-shimmer" />
          </div>
        </div>
      )}

      <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-[155px] sm:w-[195px] md:w-[215px] flex-shrink-0">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Hero showcase banner skeleton loader with cinematic shimmer
 */
export const HeroSkeleton: React.FC = () => {
  return (
    <div
      className="relative w-full h-[70vh] min-h-[500px] max-h-[850px] bg-[#0f111a] skeleton-shimmer flex items-end p-6 sm:p-12 lg:p-16 overflow-hidden"
      aria-busy="true"
      aria-label="Loading featured movie..."
    >
      {/* Top right badges placeholder */}
      <div className="absolute top-8 right-8 hidden sm:flex items-center gap-2">
        <div className="h-8 w-24 rounded-full bg-white/10 skeleton-shimmer" />
        <div className="h-8 w-16 rounded-full bg-white/10 skeleton-shimmer" />
      </div>

      <div className="max-w-2xl w-full space-y-4 relative z-10">
        <div className="h-6 bg-amber-500/20 border border-amber-500/30 rounded-full w-32 skeleton-shimmer" />
        <div className="h-10 sm:h-14 bg-white/15 rounded-xl w-4/5 skeleton-shimmer" />
        <div className="flex items-center gap-3 pt-1">
          <div className="h-4 bg-white/10 rounded w-16 skeleton-shimmer" />
          <div className="h-4 bg-white/10 rounded w-20 skeleton-shimmer" />
          <div className="h-4 bg-white/10 rounded w-24 skeleton-shimmer" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-white/10 rounded w-full skeleton-shimmer" />
          <div className="h-4 bg-white/10 rounded w-5/6 skeleton-shimmer" />
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="h-12 bg-amber-500/30 rounded-xl w-36 skeleton-shimmer" />
          <div className="h-12 bg-white/10 rounded-xl w-36 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

/**
 * Comprehensive movie details page skeleton loader
 */
export const MovieDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0c10] pb-16" aria-busy="true" aria-label="Loading movie details...">
      {/* Backdrop Header Skeleton */}
      <div className="relative h-[55vh] min-h-[400px] max-h-[600px] w-full bg-[#12141e] skeleton-shimmer overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/50 to-transparent" />
      </div>

      {/* Main Content Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Box */}
          <div className="w-56 sm:w-64 aspect-[2/3] bg-[#151722] rounded-2xl border border-white/10 overflow-hidden shadow-2xl skeleton-shimmer flex-shrink-0" />

          {/* Details header */}
          <div className="flex-1 space-y-4 pt-4 md:pt-12 w-full">
            <div className="flex flex-wrap gap-2">
              <div className="h-5 w-20 bg-amber-500/20 rounded-md skeleton-shimmer" />
              <div className="h-5 w-16 bg-white/10 rounded-md skeleton-shimmer" />
            </div>

            <div className="h-9 sm:h-12 bg-white/15 rounded-xl w-3/4 skeleton-shimmer" />
            <div className="h-4 bg-white/10 rounded w-1/3 skeleton-shimmer" />

            {/* Quick stats row */}
            <div className="flex items-center gap-4 pt-2">
              <div className="h-6 w-16 bg-white/10 rounded skeleton-shimmer" />
              <div className="h-6 w-20 bg-white/10 rounded skeleton-shimmer" />
              <div className="h-6 w-24 bg-white/10 rounded skeleton-shimmer" />
            </div>

            {/* Overview paragraph */}
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-white/10 rounded w-full skeleton-shimmer" />
              <div className="h-4 bg-white/10 rounded w-5/6 skeleton-shimmer" />
              <div className="h-4 bg-white/10 rounded w-4/6 skeleton-shimmer" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl w-40 skeleton-shimmer" />
              <div className="h-12 bg-white/10 border border-white/10 rounded-xl w-40 skeleton-shimmer" />
            </div>
          </div>
        </div>

        {/* Cast Members Row Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="h-6 w-40 bg-white/10 rounded-lg skeleton-shimmer" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#151722] border border-white/5 space-y-2 text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 mx-auto skeleton-shimmer" />
                <div className="h-3.5 bg-white/10 rounded w-4/5 mx-auto skeleton-shimmer" />
                <div className="h-3 bg-white/5 rounded w-3/5 mx-auto skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
