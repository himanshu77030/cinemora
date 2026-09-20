import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Bookmark, Eye, Calendar } from 'lucide-react';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';
import { GENRE_MAP } from '../data/genres';
import { useWatchlist } from '../context/WatchlistContext';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, rank }) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const primaryGenre = movie.genre_ids?.[0]
    ? GENRE_MAP[movie.genre_ids[0]]
    : movie.genres?.[0]?.name || '';

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <div
      id={`movie-card-${movie.id}`}
      className="group relative rounded-xl overflow-hidden bg-[#151722] border border-white/5 shadow-md hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Poster Image Container */}
      <div
        className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer"
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Rank or Rating Badge */}
          {rank ? (
            <div className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-xs tracking-wider shadow-lg flex items-center gap-1">
              <span>#{rank}</span>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-white font-semibold text-xs flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{rating}</span>
            </div>
          )}

          {/* Watchlist toggle button */}
          <button
            id={`watchlist-btn-${movie.id}`}
            type="button"
            onClick={handleWatchlistClick}
            className={`pointer-events-auto p-1.5 rounded-lg backdrop-blur-md border transition-all duration-200 ${
              saved
                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-black/60 text-white border-white/15 hover:bg-black/85 hover:text-amber-400'
            }`}
            title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                {rating}
              </span>
              {primaryGenre && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/40"></span>
                  <span className="truncate text-white/80">{primaryGenre}</span>
                </>
              )}
            </div>

            <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
              {movie.overview || 'No overview available for this title.'}
            </p>

            <div className="pt-1 flex gap-2">
              <Link
                id={`details-link-${movie.id}`}
                to={`/movie/${movie.id}`}
                className="flex-1 py-1.5 px-2 bg-white/15 hover:bg-white/25 border border-white/10 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>
              <button
                id={`card-quick-watchlist-${movie.id}`}
                onClick={handleWatchlistClick}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                  saved
                    ? 'bg-amber-500 text-black'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/30'
                }`}
                title="Watchlist"
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Info (Static below poster) */}
      <div className="p-3">
        <Link
          to={`/movie/${movie.id}`}
          className="block font-medium text-sm text-white hover:text-amber-400 transition-colors truncate"
          title={movie.title}
        >
          {movie.title}
        </Link>
        <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-500" />
            {releaseYear}
          </span>
          {primaryGenre && (
            <span className="truncate text-[11px] bg-white/5 px-1.5 py-0.5 rounded text-neutral-400 border border-white/5">
              {primaryGenre}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
