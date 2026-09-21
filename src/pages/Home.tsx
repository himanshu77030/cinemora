import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Tv, Play } from 'lucide-react';
import { Movie } from '../types';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getBestMoviesOfYear
} from '../services/tmdb';
import { TMDB_GENRES } from '../data/genres';
import { FREE_MOVIES } from '../data/freeMovies';
import { Hero } from '../components/Hero';
import { MovieCarousel } from '../components/MovieCarousel';
import { GenreCard } from '../components/GenreCard';
import { setDocumentTitle } from '../utils/seo';

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [bestOfYear, setBestOfYear] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setDocumentTitle(
      'Cinemora - Discover the Best Movies',
      'Discover, explore, and track movies across genres, years, ratings, and trending charts with real TMDB data.'
    );

    let isMounted = true;
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [trendRes, popRes, topRes, nowRes, upRes, yearRes] = await Promise.all([
          getTrendingMovies('day'),
          getPopularMovies(1),
          getTopRatedMovies(1),
          getNowPlayingMovies(1),
          getUpcomingMovies(1),
          getBestMoviesOfYear(currentYear, 1)
        ]);

        if (isMounted) {
          setTrending(trendRes);
          setFeatured(trendRes.slice(0, 5));
          setPopular(popRes.results);
          setTopRated(topRes.results);
          setNowPlaying(nowRes.results);
          setUpcoming(upRes.results);
          setBestOfYear(yearRes.results);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, [currentYear]);

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* 1. Hero Section with Carousel */}
      <Hero featuredMovies={featured} loading={loading} />

      {/* 2. Trending Now Section */}
      <div className="max-w-7xl mx-auto">
        <MovieCarousel
          title="Trending Now"
          subtitle="The most-watched films in cinema today"
          movies={trending}
          viewAllLink="/trending"
          loading={loading}
          showRank
        />

        {/* Free Full Movies to Stream Section */}
        <div className="my-4">
          <div className="px-4 sm:px-6 lg:px-8 mb-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-white/5 to-amber-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black flex-shrink-0 shadow">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-display">
                      Watch Full Movies Free
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-black">
                      No Subscription
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Stream blockbusters, indie gems & horror icons legally on YouTube, Tubi TV & Pluto TV
                  </p>
                </div>
              </div>

              <Link
                to="/free-movies"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md flex-shrink-0"
              >
                <span>Explore Free Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <MovieCarousel
            title="Stream Free Now"
            subtitle="Full movies with free legal streaming on YouTube, Tubi & Pluto TV"
            movies={FREE_MOVIES}
            viewAllLink="/free-movies"
            loading={false}
          />
        </div>

        {/* 3. Popular Movies Section */}
        <MovieCarousel
          title="Popular Movies"
          subtitle="Top audience favorites right now"
          movies={popular}
          viewAllLink="/movies?sort=popularity.desc"
          loading={loading}
        />

        {/* 4. Top Rated Section */}
        <MovieCarousel
          title="Top Rated Classics"
          subtitle="Highest critic and community acclaimed films of all time"
          movies={topRated}
          viewAllLink="/top-rated"
          loading={loading}
        />

        {/* 5. Now Playing in Theaters */}
        <MovieCarousel
          title="Now Playing"
          subtitle="Fresh theatrical and new premiering titles"
          movies={nowPlaying}
          viewAllLink="/movies"
          loading={loading}
        />

        {/* 6. Upcoming Movies */}
        <MovieCarousel
          title="Upcoming Releases"
          subtitle="Anticipated cinematic releases on the horizon"
          movies={upcoming}
          viewAllLink="/movies"
          loading={loading}
        />

        {/* 7. Best Movies of the Year */}
        <MovieCarousel
          title={`Best Movies of ${currentYear}`}
          subtitle={`The defining masterworks and blockbusters of ${currentYear}`}
          movies={bestOfYear}
          viewAllLink={`/year/${currentYear}`}
          loading={loading}
        />

        {/* 8. Browse by Genre Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Browse by Genre</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Explore dedicated cinematic collections by theme, mood, and style
              </p>
            </div>
            <Link
              to="/genres"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
            >
              <span>All Genres</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TMDB_GENRES.slice(0, 8).map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
