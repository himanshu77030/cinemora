import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, ExternalLink, ShieldCheck } from 'lucide-react';
import { TMDB_GENRES } from '../data/genres';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#08090d] text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
                <Film className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white font-display uppercase">
                CINEMORA
              </span>
            </Link>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              Cinemora is a modern cinematic movie discovery and recommendation platform. Explore trending releases, timeless masterworks, detailed cast credits, trailers, and personalized watchlists powered by real TMDB data.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Movie discovery platform (non-streaming, reference only)</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/movies" className="hover:text-amber-400 transition-colors">
                  All Movies
                </Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-amber-400 transition-colors">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link to="/top-rated" className="hover:text-amber-400 transition-colors">
                  Top Rated Films
                </Link>
              </li>
              <li>
                <Link to="/years" className="hover:text-amber-400 transition-colors">
                  Movies by Year
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-amber-400 transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Genres */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Popular Genres</h4>
            <ul className="space-y-2 text-sm">
              {TMDB_GENRES.slice(0, 5).map((g) => (
                <li key={g.id}>
                  <Link to={`/genre/${g.id}`} className="hover:text-amber-400 transition-colors">
                    {g.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/genres" className="text-amber-400 hover:text-amber-300 font-medium">
                  View all genres →
                </Link>
              </li>
            </ul>
          </div>

          {/* TMDB Attribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Data Source</h4>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white bg-[#01b4e4] px-1.5 py-0.5 rounded text-black tracking-wider">
                  TMDB
                </span>
                <span className="text-xs font-semibold text-white">The Movie Database</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline pt-1"
              >
                <span>Visit themoviedb.org</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Cinemora. Built with real cinematic movie data.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for cinema lovers</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
