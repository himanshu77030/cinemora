import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Play,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  Tv,
  Bookmark,
  Star,
  Calendar,
  Clock,
  X
} from 'lucide-react';
import { FREE_MOVIES } from '../data/freeMovies';
import { FreeMovie, FreePlatformName } from '../types';
import { setDocumentTitle } from '../utils/seo';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/tmdb';

export const FreeMovies: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePlayer, setActivePlayer] = useState<{ embedId: string; title: string } | null>(null);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    setDocumentTitle(
      'Watch Full Movies Free – YouTube, Tubi, Pluto TV & Plex',
      'Discover full-length movies you can legally stream for free on YouTube, Tubi TV, Pluto TV, Plex, and Internet Archive. No subscription needed.'
    );
  }, []);

  const platforms: { id: string; label: string; count?: number; iconColor?: string }[] = [
    { id: 'all', label: 'All Platforms' },
    { id: 'YouTube', label: 'YouTube Free', iconColor: 'text-red-500' },
    { id: 'Tubi', label: 'Tubi TV', iconColor: 'text-amber-400' },
    { id: 'Pluto TV', label: 'Pluto TV', iconColor: 'text-yellow-400' },
    { id: 'Plex', label: 'Plex', iconColor: 'text-orange-400' },
    { id: 'Internet Archive', label: 'Archive / Public Domain', iconColor: 'text-blue-400' }
  ];

  // Extract unique genres
  const availableGenres = useMemo(() => {
    const map = new Map<number, string>();
    FREE_MOVIES.forEach((movie) => {
      movie.genres?.forEach((g) => map.set(g.id, g.name));
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filter movies
  const filteredMovies = useMemo(() => {
    return FREE_MOVIES.filter((movie) => {
      // Platform filter
      if (selectedPlatform !== 'all') {
        const hasPlatform = movie.freeSources.some(
          (s) => s.platform.toLowerCase() === selectedPlatform.toLowerCase()
        );
        if (!hasPlatform) return false;
      }

      // Genre filter
      if (selectedGenre !== 'all') {
        const hasGenre = movie.genres?.some((g) => g.id.toString() === selectedGenre);
        if (!hasGenre) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = movie.title.toLowerCase().includes(q);
        const matchOverview = movie.overview.toLowerCase().includes(q);
        const matchTagline = movie.tagline?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchOverview && !matchTagline) return false;
      }

      return true;
    });
  }, [selectedPlatform, selectedGenre, searchQuery]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#121420] via-[#0d0f17] to-[#0b0c10] border-b border-white/5 py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>100% Free & Legal Streaming Collection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight max-w-3xl mx-auto leading-tight">
            Watch Full Movies Free Online
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Stream acclaimed blockbusters, indie triumphs, horror icons, and public domain
            masterpieces legally with zero subscription on verified platforms.
          </p>

          {/* Platform Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>YouTube Full Movies</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Tubi TV (Free With Ads)</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>Pluto TV On Demand</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Plex Free</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Internet Archive</span>
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search free movies by title or keyword..."
              className="w-full bg-[#12141e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Genre selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="free-genre-select" className="text-xs font-semibold text-neutral-400 whitespace-nowrap">
              Genre:
            </label>
            <select
              id="free-genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-[#12141e] border border-white/10 text-neutral-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Genres</option>
              {availableGenres.map((g) => (
                <option key={g.id} value={g.id.toString()}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {platforms.map((p) => {
            const active = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  active
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-[#12141e] hover:bg-white/10 text-neutral-300 border-white/10'
                }`}
              >
                {p.iconColor && !active && <span className={`w-2 h-2 rounded-full ${p.iconColor.replace('text-', 'bg-')}`} />}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Result Counter */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredMovies.length}</strong> free full titles
          </span>
          {(selectedPlatform !== 'all' || selectedGenre !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedPlatform('all');
                setSelectedGenre('all');
                setSearchQuery('');
              }}
              className="text-amber-400 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <Tv className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Free Titles Found</h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              No movies matched your current filter criteria. Try selecting "All Platforms" or clearing your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredMovies.map((movie) => {
              const saved = isInWatchlist(movie.id);
              const primarySource = movie.freeSources[0];

              return (
                <div
                  key={movie.id}
                  className="rounded-2xl bg-[#12141f] border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg group"
                >
                  {/* Poster / Backdrop Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#161826]">
                    <img
                      src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141f] via-transparent to-black/20 pointer-events-none" />

                    {/* Top badging */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black text-[11px] font-black uppercase tracking-wider shadow">
                        100% Free
                      </span>
                      {movie.isPublicDomain && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow">
                          Public Domain
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleWatchlist(movie)}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md border transition-all ${
                        saved
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-black/60 text-white border-white/20 hover:bg-black/90'
                      }`}
                      title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Movie title and metadata */}
                      <Link
                        to={`/movie/${movie.id}`}
                        className="block text-base sm:text-lg font-bold text-white hover:text-amber-400 transition-colors line-clamp-1"
                        title={movie.title}
                      >
                        {movie.title}
                      </Link>

                      <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-300">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span>{movie.release_date.split('-')[0]}</span>
                        {movie.runtime && (
                          <>
                            <span className="text-neutral-500">•</span>
                            <span>{movie.runtime} min</span>
                          </>
                        )}
                        {movie.genres?.[0] && (
                          <>
                            <span className="text-neutral-500">•</span>
                            <span className="text-neutral-400">{movie.genres[0].name}</span>
                          </>
                        )}
                      </div>

                      {/* Synopsis */}
                      <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed pt-1">
                        {movie.overview}
                      </p>
                    </div>

                    {/* Streaming Platforms Box */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 flex items-center justify-between">
                        <span>Free Watch Links</span>
                        <span className="text-emerald-400 lowercase font-medium">no subscription</span>
                      </span>

                      <div className="space-y-1.5">
                        {movie.freeSources.map((source, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  source.platform === 'YouTube'
                                    ? 'bg-red-500'
                                    : source.platform === 'Tubi'
                                    ? 'bg-amber-400'
                                    : source.platform === 'Pluto TV'
                                    ? 'bg-yellow-400'
                                    : source.platform === 'Plex'
                                    ? 'bg-orange-400'
                                    : 'bg-blue-400'
                                }`}
                              />
                              <span className="font-bold text-white truncate">{source.platform}</span>
                              <span className="text-[10px] text-neutral-400 hidden sm:inline truncate">
                                ({source.type})
                              </span>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              {source.embedId && (
                                <button
                                  onClick={() => setActivePlayer({ embedId: source.embedId!, title: movie.title })}
                                  className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                                  title="Play in Cinemora"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Play</span>
                                </button>
                              )}

                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <span>Stream</span>
                                <ExternalLink className="w-3 h-3 text-neutral-400" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Link to Movie Details */}
                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        to={`/movie/${movie.id}`}
                        className="text-xs font-semibold text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                      >
                        <span>Full Movie Details & Cast</span>
                        <span>→</span>
                      </Link>

                      {primarySource && (
                        <a
                          href={primarySource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Free</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Free Streaming Education & Tips Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-white/5 to-emerald-500/10 border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                How does Free Streaming Work on Cinemora?
              </h3>
              <p className="text-xs text-neutral-400">
                Transparent, legal, and verified streaming options
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300 pt-2">
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <strong className="text-white block">Official Ad-Supported Channels</strong>
              <p className="text-neutral-400">
                Platforms like Tubi TV, Pluto TV, and YouTube Movies license full studio films and stream them legally supported by occasional ads.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <strong className="text-white block">Public Domain Masterpieces</strong>
              <p className="text-neutral-400">
                Timeless landmark films whose copyrights have entered the public domain are preserved in 4K and 1080p by cultural archives and free to watch worldwide.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <strong className="text-white block">Universal Streaming Locator</strong>
              <p className="text-neutral-400">
                Cinemora links directly to official streaming providers. Every single movie page in our database includes direct search queries to find free legal streams.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* In-App Player Modal */}
      {activePlayer && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#12141f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-base font-bold text-white font-display">
                  Now Streaming: {activePlayer.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePlayer(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white"
                aria-label="Close player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activePlayer.embedId}?autoplay=1`}
                title={activePlayer.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span>Streaming via YouTube Official Embed</span>
              <a
                href={`https://www.youtube.com/watch?v=${activePlayer.embedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Open directly on YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
