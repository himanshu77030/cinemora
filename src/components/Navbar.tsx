import React, { useState, useEffect, useRef } from 'react';
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
  User,
  ChevronDown
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useWatchlist } from '../context/WatchlistContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);

  const location = useLocation();
  const { watchlist } = useWatchlist();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setExploreDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for Explore dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary desktop links (focused & uncluttered)
  const primaryLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Free Movies', path: '/free-movies', isFree: true },
    { name: 'Trending', path: '/trending' }
  ];

  // Curated explore dropdown items
  const exploreItems = [
    {
      name: 'Top Rated',
      path: '/top-rated',
      desc: 'Highest rated audience favorites',
      icon: Star
    },
    {
      name: 'Genres',
      path: '/genres',
      desc: 'Filter by 19 film categories',
      icon: Grid
    },
    {
      name: 'Release Years',
      path: '/years',
      desc: 'Browse cinematic eras 1970–2026',
      icon: Calendar
    }
  ];

  const isExploreActive = ['/top-rated', '/genres', '/years'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#07090e]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/50'
            : 'bg-gradient-to-b from-[#07090e]/95 via-[#07090e]/75 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left Side: Brand Logo + Primary Nav */}
          <div className="flex items-center gap-6 xl:gap-8 flex-shrink-0">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              id="nav-brand-logo"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <Film className="w-4.5 h-4.5 text-black stroke-[2.4]" />
              </div>
              <span className="text-xl font-black tracking-wider text-white font-display uppercase group-hover:text-amber-400 transition-colors">
                CINEM<span className="text-amber-400">ORA</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-amber-400 bg-white/10 shadow-sm'
                        : link.isFree
                        ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  {link.isFree && (
                    <span className="px-1.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-emerald-500 text-black shadow-sm flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2" />
                      <span>FREE</span>
                    </span>
                  )}
                </NavLink>
              ))}

              {/* Elegant Explore Dropdown */}
              <div
                ref={exploreRef}
                className="relative"
                onMouseEnter={() => setExploreDropdownOpen(true)}
                onMouseLeave={() => setExploreDropdownOpen(false)}
              >
                <button
                  type="button"
                  id="nav-explore-btn"
                  onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
                    isExploreActive
                      ? 'text-amber-400 bg-white/10 font-bold'
                      : exploreDropdownOpen
                      ? 'text-white bg-white/5'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                  aria-expanded={exploreDropdownOpen}
                >
                  <span>Explore</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      exploreDropdownOpen ? 'rotate-180 text-amber-400' : 'text-neutral-400'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {exploreDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="rounded-2xl bg-[#0f111c]/95 border border-white/10 backdrop-blur-2xl p-2 shadow-2xl shadow-black/80 space-y-1">
                      {exploreItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname.startsWith(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setExploreDropdownOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              active
                                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                                : 'hover:bg-white/5 text-neutral-200 hover:text-white'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg ${
                                active ? 'bg-amber-500 text-black' : 'bg-white/5 text-amber-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold">{item.name}</div>
                              <div className="text-[11px] text-neutral-400 font-normal">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Side: Search + Watchlist + Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end max-w-lg">
            {/* Desktop Search Bar (compact & sleek) */}
            <div className="hidden sm:block w-44 lg:w-56 xl:w-68 transition-all duration-300 focus-within:w-64 xl:focus-within:w-80">
              <SearchBar compact />
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 text-neutral-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Open search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Watchlist Quick Nav */}
            <Link
              to="/watchlist"
              id="nav-watchlist-link"
              className="relative p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 border border-white/5 transition-colors flex items-center justify-center flex-shrink-0"
              title="My Watchlist"
            >
              <Bookmark className="w-4 h-4 text-neutral-300 hover:text-amber-400 transition-colors" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center shadow">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Profile & Login Action in Taskbar */}
            <div id="nav-profile-section" className="flex items-center flex-shrink-0">
              <UserProfileDropdown />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-xl hover:bg-white/10 border border-white/5 transition-colors flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pb-3 pt-1 border-t border-white/5 bg-[#07090e]/95 animate-in fade-in slide-in-from-top-1 duration-150">
            <SearchBar onSearchSubmitted={() => setMobileSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 bg-[#0c0e18]/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-2xl animate-in fade-in duration-200 max-h-[80vh] overflow-y-auto">
            {/* Primary Mobile Links */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
                Main
              </div>
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/20'
                        : link.isFree
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    {link.isFree && <Tv className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{link.name}</span>
                  </span>
                  {link.isFree && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500 text-black">
                      FREE
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Explore Section */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
                Explore Categories
              </div>
              {exploreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Watchlist & Profile Actions */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <Link
                to="/watchlist"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Watchlist</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                  {watchlist.length}
                </span>
              </Link>

              {isAuthenticated && user ? (
                <Link
                  to="/profile"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-xs flex items-center justify-center">
                      {user.avatar || '🎬'}
                    </span>
                    <span>{user.name}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300">
                    Profile
                  </span>
                </Link>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
                  >
                    <User className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                    <span>Sign In to Cinemora</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Mobile Convenience */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around">
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
          <span className="absolute -top-1 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
