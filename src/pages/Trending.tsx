import React, { useState, useEffect } from 'react';
import { Flame, Users, Trophy } from 'lucide-react';
import { Movie, TrendingActor, TimeWindow } from '../types';
import { getTrendingMovies, getTrendingActors, getImageUrl } from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { setDocumentTitle } from '../utils/seo';

export const Trending: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<TrendingActor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDocumentTitle(
      'Trending Movies & Actors | Cinemora',
      'See what is trending in global cinema today and this week with ranking positions and trending talent.'
    );

    let isMounted = true;
    setLoading(true);

    Promise.all([getTrendingMovies(timeWindow), getTrendingActors()])
      .then(([movieRes, actorRes]) => {
        if (isMounted) {
          setMovies(movieRes);
          setActors(actorRes);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [timeWindow]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold mb-1">
            <Flame className="w-4 h-4 fill-current" />
            <span>Real-time Velocity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Trending Cinema
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Films and creators capturing global audiences right now
          </p>
        </div>

        {/* Today vs This Week Tabs */}
        <div className="flex p-1 bg-[#131520] border border-white/10 rounded-xl">
          <button
            id="trending-today-tab"
            onClick={() => setTimeWindow('day')}
            className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              timeWindow === 'day'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            id="trending-week-tab"
            onClick={() => setTimeWindow('week')}
            className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              timeWindow === 'week'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Top 3 Podium Highlights Banner */}
      {!loading && movies.length >= 3 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-[#141724] to-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/25">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                #1 Box Office & Discovery Leader
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                {movies[0].title}
              </h3>
              <p className="text-xs text-neutral-400">
                ⭐ {movies[0].vote_average.toFixed(1)} rating • {movies[0].release_date?.split('-')[0]}
              </p>
            </div>
          </div>
          <span className="text-xs text-neutral-400">
            Updated hourly via TMDB trending algorithm
          </span>
        </div>
      )}

      {/* Ranked Trending Movie Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Ranked Titles ({timeWindow === 'day' ? 'Today' : 'This Week'})</span>
        </h2>
        <MovieGrid movies={movies} loading={loading} showRank />
      </div>

      {/* Trending Actors Section */}
      {actors.length > 0 && (
        <div className="pt-10 border-t border-white/5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Trending Actors & Talent</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Actors leading current box office hits and trending streams
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {actors.map((actor, idx) => (
              <div
                key={actor.id}
                className="bg-[#12141f] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center space-y-3 group hover:border-amber-500/30 transition-all"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-black/60 border border-white/10 shadow-lg">
                  <img
                    src={
                      actor.profile_path
                        ? getImageUrl(actor.profile_path, 'w200')
                        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
                    }
                    alt={actor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold shadow">
                    #{idx + 1}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-[140px]">
                    {actor.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {actor.known_for?.[0]?.title || actor.known_for_department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
