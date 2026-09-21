import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Info, Bookmark, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, MovieVideo } from '../types';
import { getBackdropUrl, getImageUrl, getMovieVideos } from '../services/tmdb';
import { GENRE_MAP } from '../data/genres';
import { useWatchlist } from '../context/WatchlistContext';
import { TrailerModal } from './TrailerModal';
import { HeroSkeleton } from './LoadingSkeleton';

interface HeroProps {
  featuredMovies: Movie[];
  loading?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ featuredMovies, loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState<MovieVideo | null>(null);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const activeMovie = featuredMovies[currentIndex] || featuredMovies[0];
  const saved = activeMovie ? isInWatchlist(activeMovie.id) : false;

  // Auto-advance hero carousel every 7 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1 || isPaused || trailerOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredMovies.length, isPaused, trailerOpen]);

  const handleOpenTrailer = async (movie: Movie) => {
    try {
      const videos = await getMovieVideos(movie.id);
      const officialTrailer =
        videos.find((v) => v.type === 'Trailer' && v.official) ||
        videos.find((v) => v.type === 'Trailer') ||
        videos[0];
      setCurrentTrailer(officialTrailer || null);
    } catch {
      setCurrentTrailer(null);
    }
    setTrailerOpen(true);
  };

  if (loading || !activeMovie) {
    return <HeroSkeleton />;
  }

  const releaseYear = activeMovie.release_date ? activeMovie.release_date.split('-')[0] : '';
  const rating = activeMovie.vote_average ? activeMovie.vote_average.toFixed(1) : 'NR';
  const genres = (activeMovie.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id] || '')
    .filter(Boolean);

  return (
    <div
      id="hero-banner"
      className="relative w-full h-[75vh] min-h-[540px] max-h-[820px] overflow-hidden select-none bg-[#090a0f]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop with Gradient Overlays */}
      <div className="absolute inset-0">
        <img
          key={activeMovie.id}
          src={getBackdropUrl(activeMovie.backdrop_path, 'original')}
          alt={activeMovie.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out"
        />
        {/* Gradients: Left highlight, bottom blackout fade, subtle dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent w-full md:w-3/4"></div>
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-14 sm:pb-16">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8 max-w-4xl">
          {/* Movie Poster thumbnail (Visible on medium+ screens) */}
          <div className="hidden lg:block w-44 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-[#12141e]">
            <img
              src={getImageUrl(activeMovie.poster_path, 'w500')}
              alt={activeMovie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text & Action buttons */}
          <div className="space-y-4">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold flex items-center gap-1 shadow-md shadow-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{rating} Rating</span>
              </span>

              {releaseYear && (
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>{releaseYear}</span>
                </span>
              )}

              {activeMovie.runtime && (
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-neutral-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{activeMovie.runtime} min</span>
                </span>
              )}

              {genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display drop-shadow-md">
              {activeMovie.title}
            </h1>

            {/* Short overview */}
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl line-clamp-3 leading-relaxed drop-shadow">
              {activeMovie.overview}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-watch-trailer-btn"
                onClick={() => handleOpenTrailer(activeMovie)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm sm:text-base transition-all flex items-center gap-2 shadow-lg shadow-amber-500/30 transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Trailer</span>
              </button>

              <Link
                id="hero-view-details-btn"
                to={`/movie/${activeMovie.id}`}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-semibold rounded-xl text-sm sm:text-base transition-all flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span>View Details</span>
              </Link>

              <button
                id="hero-toggle-watchlist-btn"
                onClick={() => toggleWatchlist(activeMovie)}
                className={`p-3 rounded-xl backdrop-blur-md border transition-all ${
                  saved
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                }`}
                title={saved ? 'In Watchlist' : 'Add to Watchlist'}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Controls (Left / Right) */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? featuredMovies.length - 1 : prev - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white backdrop-blur-md transition-all hidden md:flex items-center justify-center opacity-70 hover:opacity-100"
            aria-label="Previous movie"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white backdrop-blur-md transition-all hidden md:flex items-center justify-center opacity-70 hover:opacity-100"
            aria-label="Next movie"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-6 sm:right-10 z-20 flex items-center gap-2">
            {featuredMovies.slice(0, 6).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        video={currentTrailer}
        movieTitle={activeMovie.title}
      />
    </div>
  );
};
