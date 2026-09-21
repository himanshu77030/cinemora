import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { MovieDetails } from './pages/MovieDetails';
import { Search } from './pages/Search';
import { Genres } from './pages/Genres';
import { GenreMovies } from './pages/GenreMovies';
import { Years } from './pages/Years';
import { YearMovies } from './pages/YearMovies';
import { Trending } from './pages/Trending';
import { TopRated } from './pages/TopRated';
import { Watchlist } from './pages/Watchlist';
import { FreeMovies } from './pages/FreeMovies';
import { Film, Home as HomeIcon } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-28 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white font-display">404 - Page Not Found</h1>
      <p className="text-sm text-neutral-400">
        The cinematic page or movie catalog view you are seeking does not exist.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/25"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <WatchlistProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f0f1f5] font-sans selection:bg-amber-500 selection:text-black">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/free-movies" element={<FreeMovies />} />
              <Route path="/free" element={<FreeMovies />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/genre/:genreId" element={<GenreMovies />} />
              <Route path="/years" element={<Years />} />
              <Route path="/year/:year" element={<YearMovies />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/top-rated" element={<TopRated />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </WatchlistProvider>
  );
}
