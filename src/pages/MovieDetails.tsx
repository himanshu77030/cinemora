import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Play,
  Bookmark,
  Share2,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  Building2,
  ArrowLeft,
  Check,
  Film,
  Users,
  Tv,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Movie, MovieCredits, MovieVideo } from '../types';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getRecommendedMovies,
  getBackdropUrl,
  getImageUrl
} from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { MovieCarousel } from '../components/MovieCarousel';
import { MovieDetailsSkeleton } from '../components/LoadingSkeleton';
import { TrailerModal } from '../components/TrailerModal';
import { setDocumentTitle } from '../utils/seo';
import { FREE_MOVIES, getFreeStreamingLinksForMovie } from '../data/freeMovies';
import { FreeWatchBadges } from '../components/FreeWatchBadges';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<MovieVideo | null>(null);
  const [copied, setCopied] = useState(false);

  const { isInWatchlist, toggleWatchlist, addToRecentlyViewed } = useWatchlist();

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchDetails = async () => {
      try {
        const [movieData, creditsData, videosData, similarData, recommendedData] =
          await Promise.all([
            getMovieDetails(id),
            getMovieCredits(id),
            getMovieVideos(id),
            getSimilarMovies(id),
            getRecommendedMovies(id)
          ]);

        if (isMounted && movieData) {
          setMovie(movieData);
          setCredits(creditsData);
          setVideos(videosData);
          setSimilar(similarData);
          setRecommended(recommendedData);
          addToRecentlyViewed(movieData);

          const primaryTrailer =
            videosData.find((v) => v.type === 'Trailer' && v.official) ||
            videosData.find((v) => v.type === 'Trailer') ||
            videosData[0] ||
            null;
          setSelectedTrailer(primaryTrailer);

          setDocumentTitle(
            `${movieData.title} - Cast, Rating, Trailer & Details | Cinemora`,
            movieData.overview ||
              `Discover full cast, crew, trailers, ratings and details for ${movieData.title}.`,
            `${window.location.origin}/movie/${movieData.id}`
          );
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Film className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-neutral-400 text-sm">
          We couldn't retrieve the specified movie details.
        </p>
        <button
          onClick={() => navigate('/movies')}
          className="px-5 py-2.5 bg-amber-500 text-black font-semibold rounded-xl text-sm"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const saved = isInWatchlist(movie.id);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  // Group crew by key roles
  const directors = credits?.crew.filter((c) => c.job === 'Director') || [];
  const writers = credits?.crew.filter((c) => ['Writer', 'Screenplay', 'Author'].includes(c.job)) || [];
  const producers = credits?.crew.filter((c) => ['Producer', 'Executive Producer'].includes(c.job)).slice(0, 3) || [];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${movie.title} - Cinemora`,
          text: `Check out ${movie.title} on Cinemora:`,
          url
        });
      } catch (e) {
        // Fallback to copy
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount || amount === 0) return 'Not Disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Check if this title is in our verified free catalog or generate streaming links
  const matchingFreeMovie = FREE_MOVIES.find(
    (m) => m.id === Number(id) || (movie && m.title.toLowerCase() === movie.title.toLowerCase())
  );
  const streamSources =
    matchingFreeMovie?.freeSources ||
    (movie ? getFreeStreamingLinksForMovie(movie.title, releaseYear) : []);

  return (
    <div className="pb-20">
      {/* 1. Backdrop Banner with Gradient Overlays */}
      <div className="relative w-full h-[55vh] min-h-[420px] max-h-[640px] bg-[#0c0e16] overflow-hidden">
        <img
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-transparent to-transparent"></div>

        {/* Back navigation button */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 sm:-mt-52 relative z-20 space-y-12">
        {/* Header Block: Poster + Info */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#12141f] flex-shrink-0 mx-auto md:mx-0">
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            {/* Tagline */}
            {movie.tagline && (
              <p className="text-amber-400 text-sm sm:text-base font-semibold italic tracking-wide">
                "{movie.tagline}"
              </p>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
              {movie.title}
            </h1>

            {/* Badges / Metrics Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs sm:text-sm">
              <span className="px-3 py-1 bg-amber-500 text-black font-extrabold rounded-lg flex items-center gap-1 shadow-md shadow-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{rating} / 10</span>
              </span>

              <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 text-neutral-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{movie.release_date || releaseYear}</span>
              </span>

              {movie.runtime && (
                <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 text-neutral-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{movie.runtime} min</span>
                </span>
              )}

              {movie.original_language && (
                <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 text-neutral-300 uppercase flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{movie.original_language}</span>
                </span>
              )}
            </div>

            {/* Genres Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {(movie.genres || []).map((g) => (
                <Link
                  key={g.id}
                  to={`/genre/${g.id}`}
                  className="px-3 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full text-xs font-medium text-neutral-300 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                id="details-watch-trailer-btn"
                onClick={() => setTrailerModalOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Trailer</span>
              </button>

              {matchingFreeMovie && streamSources.length > 0 && (
                <a
                  id="details-watch-free-btn"
                  href={streamSources[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
                >
                  <Tv className="w-4 h-4" />
                  <span>Watch Free ({streamSources[0].platform})</span>
                </a>
              )}

              <button
                id="details-toggle-watchlist-btn"
                onClick={() => toggleWatchlist(movie)}
                className={`px-5 py-3 rounded-xl border font-semibold text-sm sm:text-base flex items-center gap-2 transition-all ${
                  saved
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                <span>{saved ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>

              <button
                id="details-share-btn"
                onClick={handleShare}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl transition-all"
                title="Share Movie"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Overview */}
            <div className="space-y-2 pt-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs text-neutral-400">
                Synopsis
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl">
                {movie.overview || 'No synopsis provided for this title.'}
              </p>
            </div>

            {/* Free Streaming Providers & Search Links */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Free Streaming Options</span>
                      {matchingFreeMovie ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold uppercase">
                          Verified Free
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-semibold">
                          Free Streaming Search
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Watch legal streams on YouTube, Tubi TV, Pluto TV, or Plex without a paid subscription
                    </p>
                  </div>
                </div>

                <Link
                  to="/free-movies"
                  className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Browse All Free Movies</span>
                </Link>
              </div>

              <FreeWatchBadges
                sources={streamSources}
                title={movie.title}
                onPlayEmbed={(embedId, title) => {
                  setSelectedTrailer({
                    id: embedId,
                    iso_639_1: 'en',
                    iso_3166_1: 'US',
                    key: embedId,
                    name: `${title} - Full Movie`,
                    site: 'YouTube',
                    size: 1080,
                    type: 'Feature',
                    official: true,
                    published_at: movie.release_date
                  });
                  setTrailerModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. Cast & Crew Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Cast Members */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Top Cast</span>
              </h2>
              <span className="text-xs text-neutral-400">
                {credits?.cast.length || 0} credited performers
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {(credits?.cast || []).slice(0, 8).map((actor) => (
                <div
                  key={actor.id}
                  className="bg-[#12141f] border border-white/5 rounded-xl p-3 flex flex-col items-center text-center space-y-2 group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
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
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[130px]">
                      {actor.name}
                    </h4>
                    <p className="text-[11px] text-amber-300/80 truncate max-w-[130px]">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Crew & Production Specs */}
          <div className="bg-[#12141f] border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs border-b border-white/5 pb-3">
              Production Details
            </h3>

            {/* Directors */}
            {directors.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 font-semibold">Director</span>
                <p className="text-sm font-medium text-white">
                  {directors.map((d) => d.name).join(', ')}
                </p>
              </div>
            )}

            {/* Writers */}
            {writers.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 font-semibold">Screenplay</span>
                <p className="text-sm font-medium text-white">
                  {writers.map((w) => w.name).join(', ')}
                </p>
              </div>
            )}

            {/* Producers */}
            {producers.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 font-semibold">Producers</span>
                <p className="text-sm font-medium text-white">
                  {producers.map((p) => p.name).join(', ')}
                </p>
              </div>
            )}

            {/* Budget & Revenue */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  Budget
                </span>
                <p className="text-xs sm:text-sm font-medium text-white mt-0.5">
                  {formatCurrency(movie.budget)}
                </p>
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  Box Office Revenue
                </span>
                <p className="text-xs sm:text-sm font-medium text-white mt-0.5">
                  {formatCurrency(movie.revenue)}
                </p>
              </div>
            </div>

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="space-y-2 border-t border-white/5 pt-3">
                <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Studios & Production
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.production_companies.map((company) => (
                    <span
                      key={company.id}
                      className="px-2.5 py-1 bg-white/5 rounded-lg text-xs text-neutral-300 border border-white/5"
                    >
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Embedded Trailer Section */}
        {selectedTrailer && (
          <div className="space-y-4 pt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400 fill-current" />
              <span>Official Trailer</span>
            </h2>
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.key}?rel=0`}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* 5. Similar Movies */}
        {similar.length > 0 && (
          <MovieCarousel
            title="Similar Movies"
            subtitle={`Movies sharing thematic tone with ${movie.title}`}
            movies={similar}
          />
        )}

        {/* 6. Recommended Movies */}
        {recommended.length > 0 && (
          <MovieCarousel
            title="You May Also Like"
            subtitle="Curated recommendations based on viewer preferences"
            movies={recommended}
          />
        )}
      </div>

      {/* Trailer Modal (when activated via button) */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        video={selectedTrailer}
        movieTitle={movie.title}
      />
    </div>
  );
};
