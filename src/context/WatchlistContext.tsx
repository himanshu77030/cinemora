import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, WatchlistItem } from '../types';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  toggleWatchlist: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
  clearWatchlist: () => void;
  recentlyViewed: Movie[];
  addToRecentlyViewed: (movie: Movie) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const WATCHLIST_STORAGE_KEY = 'cinemora_watchlist';
const RECENT_STORAGE_KEY = 'cinemora_recently_viewed';

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Could not save watchlist to localStorage', e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch (e) {
      console.warn('Could not save recently viewed to localStorage', e);
    }
  }, [recentlyViewed]);

  const isInWatchlist = (id: number): boolean => {
    return watchlist.some(item => item.id === id);
  };

  const addToWatchlist = (movie: Movie) => {
    if (!isInWatchlist(movie.id)) {
      const newItem: WatchlistItem = {
        ...movie,
        addedAt: Date.now()
      };
      setWatchlist(prev => [newItem, ...prev]);
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  const toggleWatchlist = (movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const addToRecentlyViewed = (movie: Movie) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [movie, ...filtered].slice(0, 12);
    });
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        clearWatchlist,
        recentlyViewed,
        addToRecentlyViewed
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
