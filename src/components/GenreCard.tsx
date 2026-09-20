import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import { Genre } from '../types';

interface GenreCardProps {
  genre: Genre;
}

export const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  return (
    <Link
      to={`/genre/${genre.id}`}
      id={`genre-card-${genre.id}`}
      className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden border border-white/10 bg-[#13151f] shadow-lg hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-end p-5"
    >
      {/* Background Image */}
      {genre.backdrop && (
        <img
          src={genre.backdrop}
          alt={genre.name}
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      )}

      {/* Atmospheric dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/70 transition-all"></div>

      {/* Content */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
              <Film className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide font-display group-hover:text-amber-300 transition-colors">
              {genre.name}
            </h3>
          </div>
          <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-amber-500 group-hover:text-black transform group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {genre.description && (
          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
            {genre.description}
          </p>
        )}
      </div>
    </Link>
  );
};
