import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Film,
  Compass,
  Flame,
  Star,
  Bookmark,
  Calendar,
  Grid,
  Menu,
  X,
  Search
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useWatchlist } from '../context/WatchlistContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const location = useLocation();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Genres', path: '/genres' },
    { name: 'Years', path: '/years' },
    { name: 'Trending', path: '/trending' },
    { name: 'Top Rated', path: '/top-rated' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0b0c10]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40'
            : 'bg-gradient-to-b from-[#0b0c10]/95 via-[#0b0c10]/70 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            id="nav-brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5 h-5 text-black stroke-[2.2]" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-display uppercase group-hover:text-amber-400 transition-colors">
              CINEMORA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-amber-400 bg-white/10 font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Search bar & Utility Actions */}
          <div className="flex items-center gap-3 flex-1 max-w-sm sm:max-w-md lg:max-w-lg justify-end">
            {/* Desktop Search Bar */}
            <div className="hidden sm:block w-full">
              <SearchBar compact />
            </div>

            {/* Mobile Search Button toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Watchlist Quick Nav */}
            <Link
              to="/watchlist"
              id="nav-watchlist-link"
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors flex items-center justify-center flex-shrink-0"
              title="My Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-xl hover:bg-white/10 border border-white/5"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pb-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <SearchBar onSearchSubmitted={() => setMobileSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 bg-[#0d0f17]/98 backdrop-blur-2xl px-4 py-4 space-y-2 shadow-2xl animate-in fade-in duration-200">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/watchlist"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>My Watchlist</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold">
                {watchlist.length}
              </span>
            </Link>
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Mobile Convenience */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e15]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <Film className="w-4 h-4" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </NavLink>

        <NavLink
          to="/trending"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <Flame className="w-4 h-4" />
          <span>Trending</span>
        </NavLink>

        <NavLink
          to="/top-rated"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <Star className="w-4 h-4" />
          <span>Top</span>
        </NavLink>

        <NavLink
          to="/watchlist"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist</span>
          {watchlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center">
              {watchlist.length}
            </span>
          )}
        </NavLink>
      </div>
    </>
  );
};
