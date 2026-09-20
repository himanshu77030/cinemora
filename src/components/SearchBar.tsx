import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Film,
  Star,
  Loader2,
  ArrowRight,
  Clock,
  Sparkles,
  CornerDownLeft,
  ChevronRight
} from 'lucide-react';
import { Movie } from '../types';
import { searchMovies, getImageUrl } from '../services/tmdb';
import { TMDB_GENRES } from '../data/genres';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  compact?: boolean;
  onSearchSubmitted?: () => void;
}

const RECENT_SEARCHES_KEY = 'cinemora_recent_searches';
const POPULAR_SEARCH_TERMS = ['Dune', 'Oppenheimer', 'Interstellar', 'The Dark Knight', 'Gladiator', 'Spider-Man'];

export const SearchBar: React.FC<SearchBarProps> = ({ compact = false, onSearchSubmitted }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [matchedGenres, setMatchedGenres] = useState<typeof TMDB_GENRES>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Snappy debounce for real-time responsiveness
  const debouncedQuery = useDebounce(query, 200);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage error
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((s) => s !== term);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch real-time autocomplete suggestions as user types
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      setMatchedGenres([]);
      setIsLoading(false);
      setSelectedIndex(-1);
      return;
    }

    // Genre title autocomplete matches (e.g. user typed "Sci", "Action", "Horror")
    const genreMatches = TMDB_GENRES.filter((g) =>
      g.name.toLowerCase().includes(trimmed.toLowerCase())
    ).slice(0, 2);
    setMatchedGenres(genreMatches);

    setIsLoading(true);
    let isCurrent = true;

    searchMovies(trimmed, 1)
      .then((res) => {
        if (isCurrent) {
          // Sort results prioritizing titles starting with or containing query
          const sorted = [...(res.results || [])].sort((a, b) => {
            const aStartsWith = a.title.toLowerCase().startsWith(trimmed.toLowerCase());
            const bStartsWith = b.title.toLowerCase().startsWith(trimmed.toLowerCase());
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return (b.popularity || 0) - (a.popularity || 0);
          });
          setSuggestions(sorted.slice(0, 6));
          setSelectedIndex(-1);
          setIsOpen(true);
        }
      })
      .catch((err) => {
        console.error('Autocomplete search error:', err);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  // Navigate suggestions via Keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    const totalItems = suggestions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        // Navigate directly to highlighted movie
        handleSelectMovie(suggestions[selectedIndex]);
      } else {
        // Submit search query
        handleSubmit(e);
      }
    } else if (e.key === 'Tab') {
      // Autocomplete fill if a suggestion exists and user presses Tab
      if (suggestions.length > 0) {
        e.preventDefault();
        const targetTitle = selectedIndex >= 0 ? suggestions[selectedIndex].title : suggestions[0].title;
        setQuery(targetTitle);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onSearchSubmitted?.();
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    saveRecentSearch(movie.title);
    setIsOpen(false);
    setQuery('');
    navigate(`/movie/${movie.id}`);
    onSearchSubmitted?.();
  };

  const handleSelectGenre = (genreId: number) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/genre/${genreId}`);
    onSearchSubmitted?.();
  };

  const handleFillQuery = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setQuery(title);
    inputRef.current?.focus();
  };

  // Helper to highlight matching text in title
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span key={idx} className="text-amber-400 font-bold bg-amber-400/10 px-0.5 rounded">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  // Helper to get genre name from ID
  const getGenreName = (genreId?: number) => {
    if (!genreId) return null;
    return TMDB_GENRES.find((g) => g.id === genreId)?.name;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Search / Loading Icon */}
        <div className="absolute left-3.5 text-neutral-400 pointer-events-none flex items-center z-10">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search movies, actors, genres... (Press '/' to focus)"
          autoComplete="off"
          spellCheck={false}
          className={`w-full bg-[#12141e]/80 hover:bg-[#12141e]/95 text-white placeholder:text-neutral-400 rounded-xl pl-10 pr-16 border border-white/12 hover:border-white/20 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/25 backdrop-blur-md transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] ${
            compact ? 'py-2 text-xs' : 'py-2.5 text-sm'
          }`}
        />

        {/* Right side actions inside input */}
        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setMatchedGenres([]);
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="p-1 text-neutral-400 hover:text-white rounded-md transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white/5 border border-white/10 rounded pointer-events-none">
              /
            </kbd>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          ref={listRef}
          className="glass-search-results absolute left-0 sm:left-auto sm:right-0 w-full sm:w-[480px] top-full mt-2.5 rounded-2xl overflow-hidden z-50 divide-y divide-white/[0.07] max-h-[520px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Ambient top specular reflection line */}
          <div className="sticky top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-30" />

          {/* Active typed suggestions */}
          {query.trim() ? (
            <div>
              {/* Matched Genre Quick Filters */}
              {matchedGenres.length > 0 && (
                <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/[0.04] to-transparent flex flex-wrap items-center gap-2 border-b border-white/[0.08]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Genre Match:
                  </span>
                  {matchedGenres.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleSelectGenre(g.id)}
                      className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-amber-500/25 border border-white/10 hover:border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
                    >
                      <span>{g.name}</span>
                      <ChevronRight className="w-3 h-3 text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title matches */}
              {suggestions.length > 0 ? (
                <div className="p-2 space-y-1.5">
                  <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span>Movie Matches</span>
                    </span>
                    <span className="text-[10px] text-neutral-400/80 font-mono tracking-tight lowercase">
                      ↑↓ navigate • ↵ open • tab fill
                    </span>
                  </div>

                  {suggestions.map((m, idx) => {
                    const isSelected = idx === selectedIndex;
                    const primaryGenre = getGenreName(m.genre_ids?.[0]);
                    const year = m.release_date ? m.release_date.split('-')[0] : null;

                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMovie(m)}
                        className={`glass-search-item w-full flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer group text-left ${
                          isSelected ? 'is-selected ring-1 ring-amber-500/40' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Poster Thumbnail with glossy glass frame */}
                          <div className="relative w-11 h-16 rounded-lg overflow-hidden bg-black/70 flex-shrink-0 border border-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                            {m.poster_path ? (
                              <img
                                src={getImageUrl(m.poster_path, 'w200')}
                                alt={m.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-500 bg-white/[0.03]">
                                <Film className="w-4 h-4" />
                              </div>
                            )}
                            {/* Subtle specular gloss reflection */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate text-white group-hover:text-amber-300 transition-colors">
                              {highlightMatch(m.title, debouncedQuery)}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400 mt-1.5">
                              {year && (
                                <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] text-neutral-300 font-medium">
                                  {year}
                                </span>
                              )}
                              {primaryGenre && (
                                <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] text-neutral-300 font-medium">
                                  {primaryGenre}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                {m.vote_average ? m.vote_average.toFixed(1) : 'NR'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right action icons */}
                        <div className="flex items-center gap-1 pl-2">
                          <button
                            type="button"
                            onClick={(e) => handleFillQuery(e, m.title)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-400 hover:text-amber-300 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-xs"
                            title="Autofill search input"
                          >
                            <CornerDownLeft className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-amber-500/20 group-hover:border-amber-500/30 border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-amber-300 transition-all">
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* View All Search Results Footer */}
                  <div className="p-1 pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(245,158,11,0.15)] group"
                    >
                      <span>View all matching results for "{debouncedQuery}"</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : !isLoading ? (
                <div className="p-8 text-center text-neutral-400 text-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                    <Film className="w-5 h-5" />
                  </div>
                  <p className="text-neutral-300">No direct title matches for "{debouncedQuery}".</p>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold transition-colors"
                  >
                    <span>Search whole catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            /* Blank state: Recent searches & Trending suggestions */
            <div className="p-3.5 space-y-4">
              {/* Recent searches if present */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-[10px] text-neutral-400 hover:text-rose-400 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setQuery(term);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                          setIsOpen(false);
                        }}
                        className="glass-search-item flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs text-neutral-300 group transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <Search className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 transition-colors" />
                          <span className="group-hover:text-white font-medium transition-colors">{term}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-neutral-500 hover:text-white p-1 rounded hover:bg-white/10"
                          title="Remove from history"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Discovery Picks */}
              <div className="space-y-2 pt-1">
                <div className="px-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Popular Suggestions
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {POPULAR_SEARCH_TERMS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 bg-white/[0.04] hover:bg-amber-500/20 hover:text-amber-300 border border-white/[0.08] hover:border-amber-500/40 text-neutral-300 text-xs font-medium rounded-xl transition-all shadow-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
