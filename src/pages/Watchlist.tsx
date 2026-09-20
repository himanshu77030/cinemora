import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowUpDown, Compass, Sparkles, Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { MovieCard } from '../components/MovieCard';
import { MovieCarousel } from '../components/MovieCarousel';
import { CURATED_MOVIES } from '../data/mockMovies';
import { setDocumentTitle } from '../utils/seo';

export const Watchlist: React.FC = () => {
  const { watchlist, clearWatchlist, recentlyViewed } = useWatchlist();
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'release' | 'title'>('recent');

  useEffect(() => {
    setDocumentTitle(
      'My Watchlist | Cinemora',
      'Manage your personal cinema queue, track must-watch films, and explore tailored recommendations.'
    );
  }, []);

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.vote_average || 0) - (a.vote_average || 0);
    }
    if (sortBy === 'release') {
      return (b.release_date || '').localeCompare(a.release_date || '');
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default 'recent' added
    return (b.addedAt || 0) - (a.addedAt || 0);
  });

  // Simple recommendation engine: find top genres in user watchlist and recommend other curated movies
  const watchlistGenreIds = Array.from(
    new Set(watchlist.flatMap((m) => m.genre_ids || []))
  );
  const recommendations = CURATED_MOVIES.filter(
    (m) =>
      !watchlist.some((w) => w.id === m.id) &&
      (watchlistGenreIds.length === 0 || m.genre_ids?.some((g) => watchlistGenreIds.includes(g)))
  ).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold mb-1">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display flex items-center gap-3">
            <span>My Watchlist</span>
            <span className="text-base sm:text-lg font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {watchlist.length} {watchlist.length === 1 ? 'film' : 'films'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Your saved movies queued for discovery and weekend cinema sessions
          </p>
        </div>

        {watchlist.length > 0 && (
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#12141f] border border-white/10 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
              >
                <option value="recent" className="bg-[#12141f]">Recently Added</option>
                <option value="rating" className="bg-[#12141f]">Highest Rating</option>
                <option value="release" className="bg-[#12141f]">Release Date</option>
                <option value="title" className="bg-[#12141f]">Title (A-Z)</option>
              </select>
            </div>

            {/* Clear Button */}
            <button
              id="clear-watchlist-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
                  clearWatchlist();
                }
              }}
              className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-white/5"
              title="Clear Watchlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Watchlist Grid or Empty State */}
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {sortedWatchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-[#12141f]/70 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Your Watchlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            As you discover movies, click the bookmark icon on any title to save it to your personal watchlist.
          </p>
          <div className="pt-2">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/25"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Movies</span>
            </Link>
          </div>
        </div>
      )}

      {/* "Because you saved..." Smart Recommendations */}
      {recommendations.length > 0 && (
        <div className="pt-10 border-t border-white/5">
          <MovieCarousel
            title="Because You Liked These Themes"
            subtitle="Intelligent discovery tailored to your watchlist tastes"
            movies={recommendations}
          />
        </div>
      )}

      {/* Recently Viewed Films */}
      {recentlyViewed.length > 0 && (
        <div className="pt-4 border-t border-white/5">
          <MovieCarousel
            title="Recently Viewed"
            subtitle="Titles you inspected during this session"
            movies={recentlyViewed}
          />
        </div>
      )}
    </div>
  );
};
