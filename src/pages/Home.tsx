import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
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
