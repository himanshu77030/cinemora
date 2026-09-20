import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Star, Play, Info } from 'lucide-react';
import { Movie, FilterOptions } from '../types';
import { getMoviesByGenre, getBackdropUrl, getImageUrl } from '../services/tmdb';
import { TMDB_GENRES } from '../data/genres';
import { MovieCarousel } from '../components/MovieCarousel';
import { MovieGrid } from '../components/MovieGrid';
import { FilterBar } from '../components/FilterBar';
import { setDocumentTitle } from '../utils/seo';

export const GenreMovies: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();

  // Support numeric ID or slug (e.g., '28' or 'action')
  const genre = TMDB_GENRES.find(
    (g) => String(g.id) === genreId || g.slug === genreId?.toLowerCase()
  ) || {
    id: Number(genreId) || 28,
    name: 'Genre Spotlight',
    description: 'Explore the highest rated and most popular movies in this category.'
  };

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [gridMovies, setGridMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<FilterOptions>({
    year: undefined,
    minRating: undefined,
    sortBy: 'popularity.desc'
  });

  useEffect(() => {
    setDocumentTitle(
      `Best ${genre.name} Movies | Cinemora`,
      `Discover the top rated, popular, and latest ${genre.name} movies with trailers, reviews, and cast on Cinemora.`
    );

    let isMounted = true;
    setLoading(true);

    const loadGenreSections = async () => {
      try {
        const [popRes, topRes] = await Promise.all([
          getMoviesByGenre(genre.id, 1, 'popularity.desc'),
          getMoviesByGenre(genre.id, 1, 'vote_average.desc')
        ]);

        if (isMounted) {
          setPopularMovies(popRes.results);
          setTopRatedMovies(topRes.results);
        }
      } catch (err) {
        console.error('Error loading genre data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadGenreSections();

    return () => {
      isMounted = false;
    };
  }, [genre.id, genre.name]);

  // Load grid movies when filters or page changes
  useEffect(() => {
    let isMounted = true;
    setGridLoading(true);

    getMoviesByGenre(genre.id, page, filters.sortBy || 'popularity.desc', filters.year)
      .then((res) => {
        if (isMounted) {
          let filtered = res.results;
          if (filters.minRating) {
            filtered = filtered.filter((m) => m.vote_average >= (filters.minRating || 0));
          }
          setGridMovies(filtered);
          setTotalPages(res.totalPages);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setGridLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [genre.id, page, filters]);

  const featuredMovie = popularMovies[0];

  return (
    <div className="pb-16 space-y-10">
      {/* Genre Hero Banner */}
      <div className="relative w-full h-[45vh] min-h-[360px] bg-[#10121a] overflow-hidden flex items-end">
        {featuredMovie?.backdrop_path ? (
          <img
            src={getBackdropUrl(featuredMovie.backdrop_path, 'original')}
            alt={genre.name}
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/40 via-neutral-900 to-black"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-black/40"></div>

        {/* Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <Link
            to="/genres"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            <span>All Genres</span>
          </Link>

          <div className="max-w-2xl space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Genre Spotlight
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
              {genre.name} Movies
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {genre.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Featured Spotlight Card */}
        {featuredMovie && (
          <div className="bg-[#12141f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
            <div className="w-36 sm:w-44 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl flex-shrink-0 bg-black">
              <img
                src={getImageUrl(featuredMovie.poster_path, 'w500')}
                alt={featuredMovie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 flex-1 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Featured {genre.name} Selection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {featuredMovie.title}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-3 text-xs sm:text-sm text-neutral-300">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  {featuredMovie.vote_average?.toFixed(1)}
                </span>
                <span>•</span>
                <span>{featuredMovie.release_date?.split('-')[0]}</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed max-w-2xl">
                {featuredMovie.overview}
              </p>
              <div className="pt-2">
                <Link
                  to={`/movie/${featuredMovie.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Info className="w-4 h-4" />
                  <span>Explore Movie Details</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Carousels */}
        <MovieCarousel
          title={`Popular ${genre.name} Titles`}
          subtitle="Audiences' current top picks"
          movies={popularMovies}
          loading={loading}
        />

        <MovieCarousel
          title={`Critically Acclaimed ${genre.name}`}
          subtitle="Highest voter rated cinematic entries"
          movies={topRatedMovies}
          loading={loading}
        />

        {/* Full Grid Section with Custom Filters */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              All {genre.name} Films
            </h3>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={(newF) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, ...newF }));
            }}
            onReset={() => {
              setPage(1);
              setFilters({ year: undefined, minRating: undefined, sortBy: 'popularity.desc' });
            }}
          />

          <MovieGrid movies={gridMovies} loading={gridLoading} />
        </div>
      </div>
    </div>
  );
};
