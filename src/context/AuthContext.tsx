import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, UserAccount, WatchedHistoryItem, UserPreferences } from '../types';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'forgot';
  openAuthModal: (tab?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<UserAccount>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message: string; error?: string }>;
  watchHistory: WatchedHistoryItem[];
  addToWatchHistory: (movie: Movie) => void;
  removeFromWatchHistory: (movieId: number) => void;
  clearWatchHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'cinemora_current_user';
const USERS_STORAGE_KEY = 'cinemora_users_db';
const WELCOME_DISMISSED_KEY = 'cinemora_welcome_dismissed';
const WATCH_HISTORY_KEY_PREFIX = 'cinemora_history_';

// Default avatars available for Cinemora cinephiles
export const AVATAR_OPTIONS = [
  { id: 'director', label: 'Film Director', emoji: '🎬', bg: 'from-amber-500 to-red-600' },
  { id: 'popcorn', label: 'Cinema Lover', emoji: '🍿', bg: 'from-yellow-400 to-amber-600' },
  { id: 'superhero', label: 'Hero', emoji: '🦸', bg: 'from-blue-500 to-indigo-600' },
  { id: 'scifi', label: 'Sci-Fi Explorer', emoji: '🚀', bg: 'from-purple-500 to-pink-600' },
  { id: 'detective', label: 'Noir Detective', emoji: '🕵️', bg: 'from-neutral-600 to-neutral-800' },
  { id: 'retro', label: 'VHS Collector', emoji: '📼', bg: 'from-emerald-500 to-teal-700' }
];

interface StoredUserAccount extends UserAccount {
  passwordHash: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current logged-in user
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure no stale demo user with personal data is loaded
        if (parsed.id?.includes('demo')) {
          localStorage.removeItem(CURRENT_USER_KEY);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // 2. Auth Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(WELCOME_DISMISSED_KEY) === 'true';
  });

  // On initial site visit, open the clean Sign In popup for guests
  useEffect(() => {
    const isDismissed = localStorage.getItem(WELCOME_DISMISSED_KEY) === 'true';
    const hasLoggedIn = Boolean(localStorage.getItem(CURRENT_USER_KEY));

    if (!isDismissed && !hasLoggedIn) {
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // 4. Watch history for the current user
  const historyStorageKey = user ? `${WATCH_HISTORY_KEY_PREFIX}${user.id}` : `${WATCH_HISTORY_KEY_PREFIX}guest`;
  const [watchHistory, setWatchHistory] = useState<WatchedHistoryItem[]>(() => {
    try {
      const initialKey = user ? `${WATCH_HISTORY_KEY_PREFIX}${user.id}` : `${WATCH_HISTORY_KEY_PREFIX}guest`;
      const saved = localStorage.getItem(initialKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Switch watch history when user logs in or out
  useEffect(() => {
    try {
      const currentKey = user ? `${WATCH_HISTORY_KEY_PREFIX}${user.id}` : `${WATCH_HISTORY_KEY_PREFIX}guest`;
      const saved = localStorage.getItem(currentKey);
      if (saved) {
        setWatchHistory(JSON.parse(saved));
      } else {
        setWatchHistory([]);
      }
    } catch {
      setWatchHistory([]);
    }
  }, [user?.id]);

  // Persist watch history
  useEffect(() => {
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Could not persist watch history', e);
    }
  }, [watchHistory, historyStorageKey]);

  // Get all registered users
  const getStoredUsers = (): StoredUserAccount[] => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) {
        const parsed: StoredUserAccount[] = JSON.parse(data);
        const filtered = parsed.filter((u) => !u.id?.includes('demo'));
        if (filtered.length !== parsed.length) {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
        }
        return filtered;
      }
      return [];
    } catch {
      return [];
    }
  };

  const openAuthModal = (tab: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.setItem(WELCOME_DISMISSED_KEY, 'true');
    closeAuthModal();
  };

  // Sign In
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      // Seamlessly create account if new user logs in without separate signup
      const namePart = trimmedEmail.split('@')[0] || 'Cinephile';
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const newUser: StoredUserAccount = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: capitalized,
        email: trimmedEmail,
        avatar: '🎬',
        role: 'member',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        passwordHash: password,
        preferences: {
          favoriteGenres: [],
          preferredPlatform: 'All',
          autoplayTrailers: true,
          emailNotifications: false
        }
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      const { passwordHash: _, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      localStorage.setItem(WELCOME_DISMISSED_KEY, 'true');
      setIsGuest(false);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    if (found.passwordHash !== password) {
      return { success: false, error: 'Incorrect password. Click "Forgot Password?" to reset.' };
    }

    // Login successful
    const { passwordHash: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem(WELCOME_DISMISSED_KEY, 'true');
    setIsGuest(false);
    setIsAuthModalOpen(false);

    return { success: true };
  };

  // Sign Up
  const signup = async (
    name: string,
    email: string,
    password: string,
    avatar: string = '🎬'
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: 'Please provide your name.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser: StoredUserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      email: trimmedEmail,
      avatar,
      role: 'member',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      passwordHash: password,
      preferences: {
        favoriteGenres: [],
        preferredPlatform: 'All',
        autoplayTrailers: true,
        emailNotifications: false
      }
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // Automatically sign in new user
    const { passwordHash, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem(WELCOME_DISMISSED_KEY, 'true');
    setIsGuest(false);
    setIsAuthModalOpen(false);

    return { success: true };
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setIsGuest(true);
  };

  // Update profile details
  const updateProfile = (updates: Partial<UserAccount>) => {
    if (!user) return;
    const updatedUser: UserAccount = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Update in users database
    const users = getStoredUsers();
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, ...updates };
      }
      return u;
    });
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  // Change Password
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'You must be signed in to change your password.' };
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const users = getStoredUsers();
    const found = users.find((u) => u.id === user.id);
    if (!found) return { success: false, error: 'User account not found.' };

    if (found.passwordHash !== currentPassword) {
      return { success: false, error: 'Current password does not match.' };
    }

    found.passwordHash = newPassword;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return { success: true };
  };

  // Reset Password (e.g. forgot password flow)
  const resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return { success: false, message: '', error: 'Please enter your account email.' };
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: '', error: 'Password must be at least 6 characters.' };
    }

    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      return { success: false, message: '', error: 'No Cinemora account found with this email.' };
    }

    found.passwordHash = newPassword;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return {
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.'
    };
  };

  // Watch History management
  const addToWatchHistory = (movie: Movie) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((item) => item.movie.id !== movie.id);
      return [{ movie, watchedAt: Date.now() }, ...filtered].slice(0, 30);
    });
  };

  const removeFromWatchHistory = (movieId: number) => {
    setWatchHistory((prev) => prev.filter((item) => item.movie.id !== movieId));
  };

  const clearWatchHistory = () => {
    setWatchHistory([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isGuest,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        continueAsGuest,
        updateProfile,
        changePassword,
        resetPassword,
        watchHistory,
        addToWatchHistory,
        removeFromWatchHistory,
        clearWatchHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
