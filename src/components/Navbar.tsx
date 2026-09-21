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
  Search,
  Tv,
  Sparkles,
  User
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useWatchlist } from '../context/WatchlistContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const location = useLocation();
  const { watchlist } = useWatchlist();
  const { user, isAuthenticated, openAuthModal } = useAuth();

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
    { name: 'Free Movies', path: '/free-movies', isFree: true },
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
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-amber-400 bg-white/10 font-semibold'
                      : link.isFree
                      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.isFree && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-black shadow-sm flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>FREE</span>
                  </span>
                )}
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

            {/* Profile & Login Action in Taskbar */}
            <div id="nav-profile-section" className="flex items-center">
              <UserProfileDropdown />
            </div>

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
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20'
                      : link.isFree
                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  {link.isFree && <Tv className="w-4 h-4 text-emerald-400" />}
                  <span>{link.name}</span>
                </span>
                {link.isFree && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-black">
                    FREE
                  </span>
                )}
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

            {/* Mobile Profile / Sign In Link */}
            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-200 hover:bg-white/5 border-t border-white/5 pt-3"
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-amber-500/20 text-xs flex items-center justify-center">
                    {user.avatar || '🎬'}
                  </span>
                  <span>My Profile ({user.name})</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                  {user.role}
                </span>
              </Link>
            ) : (
              <div className="pt-3 border-t border-white/5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Mobile Convenience */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e15]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around">
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
          to="/free-movies"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-emerald-400 font-bold' : 'text-emerald-400/80 hover:text-emerald-300'
            }`
          }
        >
          <Tv className="w-4 h-4" />
          <span>Free</span>
          <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <User className="w-4 h-4" />
          <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
        </NavLink>
      </div>
    </>
  );
};
