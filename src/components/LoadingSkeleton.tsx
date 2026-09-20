import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-white/5 border border-white/5 animate-pulse aspect-[2/3] flex flex-col justify-end p-4">
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-white/10 rounded w-12"></div>
          <div className="h-3 bg-white/10 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export const MovieGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[850px] bg-white/5 animate-pulse flex items-end p-6 sm:p-12 lg:p-16">
      <div className="max-w-2xl w-full space-y-4">
        <div className="h-6 bg-white/10 rounded w-32"></div>
        <div className="h-12 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="flex gap-4 pt-4">
          <div className="h-11 bg-white/15 rounded-lg w-36"></div>
          <div className="h-11 bg-white/10 rounded-lg w-36"></div>
        </div>
      </div>
    </div>
  );
};

export const MovieDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-[55vh] bg-white/5 w-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-56 sm:w-64 aspect-[2/3] bg-white/10 rounded-xl flex-shrink-0"></div>
          <div className="flex-1 space-y-4 pt-8">
            <div className="h-10 bg-white/15 rounded w-2/3"></div>
            <div className="h-5 bg-white/10 rounded w-1/3"></div>
            <div className="h-4 bg-white/10 rounded w-full pt-4"></div>
            <div className="h-4 bg-white/10 rounded w-4/5"></div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 bg-white/20 rounded-lg w-40"></div>
              <div className="h-12 bg-white/10 rounded-lg w-40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
