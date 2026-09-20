import React, { useEffect, useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { TMDB_GENRES } from '../data/genres';
import { GenreCard } from '../components/GenreCard';
import { setDocumentTitle } from '../utils/seo';

export const Genres: React.FC = () => {
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setDocumentTitle(
      'Movie Genres | Cinemora',
      'Browse and discover movies by genre including Action, Sci-Fi, Horror, Drama, Animation, and more.'
    );
  }, []);

  const filteredGenres = TMDB_GENRES.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase()) ||
    g.description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Cinematic Categories</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Browse by Genre
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore dedicated hubs tailored to every cinematic theme and tone
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter genres..."
            className="w-full bg-[#12141f] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/70"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Grid of Genre Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredGenres.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </div>
    </div>
  );
};
