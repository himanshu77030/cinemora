import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Bookmark,
  History,
  KeyRound,
  Shield,
  Sparkles,
  ChevronDown,
  Trash2,
  ExternalLink,
  Film,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { useAuth, AVATAR_OPTIONS } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/tmdb';

export const UserProfileDropdown: React.FC = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    watchHistory,
    removeFromWatchHistory,
    clearWatchHistory,
    updateProfile,
    changePassword
  } = useAuth();

  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'saved' | 'security'>('profile');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Security tab state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [securityStatus, setSecurityStatus] = useState<{ error?: string; success?: string } | null>(null);

  // Profile edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
    }
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);

    const res = await changePassword(currentPass, newPass);
    if (!res.success) {
      setSecurityStatus({ error: res.error || 'Failed to change password.' });
    } else {
      setSecurityStatus({ success: 'Password changed successfully!' });
      setCurrentPass('');
      setNewPass('');
    }
  };

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile({ name: editName.trim() });
    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 2000);
  };

  const handleSelectAvatar = (emoji: string) => {
    updateProfile({ avatar: emoji });
  };

  // If NOT authenticated, show ONLY Sign In button on taskbar
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center">
        <button
          id="taskbar-signin-btn"
          onClick={() => openAuthModal('login')}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
          title="Sign in to your account"
        >
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  // If AUTHENTICATED, show interactive user profile menu
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="taskbar-profile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all ${
          isOpen
            ? 'bg-amber-500/20 border-amber-400/50 text-white'
            : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200 hover:text-white'
        }`}
        title={`Logged in as ${user.name}`}
        aria-expanded={isOpen}
      >
        <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center text-xs font-black shadow">
          {user.avatar || '🎬'}
        </span>
        <span className="hidden md:inline-block max-w-[100px] truncate text-xs font-bold text-neutral-200">
          {user.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        />
      </button>

      {/* DROPDOWN POPUP MENU */}
      {isOpen && (
        <div
          id="user-profile-menu-card"
          className="absolute right-0 top-full mt-2 w-[340px] sm:w-[390px] rounded-2xl bg-[#0f111c] border border-white/15 shadow-2xl overflow-hidden z-50 animate-fadeIn flex flex-col max-h-[85vh]"
        >
          {/* Top User Banner */}
          <div className="p-4 bg-gradient-to-r from-[#181a28] to-[#121422] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black text-xl flex items-center justify-center shadow-lg">
                {user.avatar || '🎬'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">Member since {user.joinedDate}</p>
              </div>
            </div>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
              title="Full Profile Page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 bg-black/40 border-b border-white/5 py-2 px-3 text-center text-xs">
            <div className="border-r border-white/5">
              <span className="block text-amber-400 font-extrabold text-sm">{watchlist.length}</span>
              <span className="text-[11px] text-neutral-400">Saved Movies</span>
            </div>
            <div>
              <span className="block text-blue-400 font-extrabold text-sm">{watchHistory.length}</span>
              <span className="text-[11px] text-neutral-400">Watch History</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 bg-[#121422] text-xs font-semibold px-2 pt-1 gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 px-1 border-b-2 transition-all flex items-center justify-center gap-1 ${
                activeTab === 'profile'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 px-1 border-b-2 transition-all flex items-center justify-center gap-1 ${
                activeTab === 'saved'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Watch Later</span>
              {watchlist.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full font-bold">
                  {watchlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-1 border-b-2 transition-all flex items-center justify-center gap-1 ${
                activeTab === 'history'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {watchHistory.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded-full font-bold">
                  {watchHistory.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-2 px-1 border-b-2 transition-all flex items-center justify-center gap-1 ${
                activeTab === 'security'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Reset Pass</span>
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="p-4 overflow-y-auto max-h-[360px] space-y-3">
            {/* 1. PROFILE DETAILS TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                {/* Edit Name */}
                <form onSubmit={handleUpdateName} className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-300">Display Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-[#161826] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-colors"
                    >
                      Save
                    </button>
                  </div>
                  {saveProfileSuccess && (
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Name updated!</span>
                    </p>
                  )}
                </form>

                {/* Avatar Chooser */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Switch Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectAvatar(opt.emoji)}
                        className={`p-2 rounded-xl text-lg flex items-center justify-center border transition-all ${
                          user.avatar === opt.emoji
                            ? 'border-amber-400 bg-amber-500/20 shadow'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                        title={opt.label}
                      >
                        {opt.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Streaming Preference */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Preferred Platform:</span>
                    <span className="font-bold text-amber-400">{user.preferences?.preferredPlatform || 'All Free Platforms'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Account Type:</span>
                    <span className="font-bold text-emerald-400">Cinemora Lifetime Free</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WATCH HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {watchHistory.length} {watchHistory.length === 1 ? 'title' : 'titles'} in history
                  </span>
                  {watchHistory.length > 0 && (
                    <button
                      onClick={clearWatchHistory}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {watchHistory.length === 0 ? (
                  <div className="py-8 text-center text-neutral-400 space-y-2">
                    <History className="w-8 h-8 mx-auto text-neutral-600" />
                    <p className="text-xs">No watch history yet.</p>
                    <p className="text-[11px] text-neutral-500">
                      Movies and free streams you inspect or play will be logged here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {watchHistory.map((item) => (
                      <div
                        key={item.movie.id}
                        className="p-2 rounded-xl bg-[#161826] border border-white/5 hover:border-white/10 flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/movie/${item.movie.id}`);
                          }}
                        >
                          <img
                            src={getImageUrl(item.movie.poster_path, 'w200')}
                            alt=""
                            className="w-8 h-12 object-cover rounded-lg bg-neutral-800 flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=100&auto=format&fit=crop';
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                              {item.movie.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                              <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                {item.movie.vote_average?.toFixed(1) || '7.5'}
                              </span>
                              <span>•</span>
                              <span>{new Date(item.watchedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromWatchHistory(item.movie.id)}
                          className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                          title="Remove from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SAVED MOVIES (WATCHLIST) TAB */}
            {activeTab === 'saved' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} bookmarked
                  </span>
                  <Link
                    to="/watchlist"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Watchlist Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {watchlist.length === 0 ? (
                  <div className="py-8 text-center text-neutral-400 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto text-neutral-600" />
                    <p className="text-xs">Your watchlist is empty.</p>
                    <p className="text-[11px] text-neutral-500">
                      Bookmark movies from trending, free movies, or details pages!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {watchlist.slice(0, 5).map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/movie/${movie.id}`);
                        }}
                        className="p-2 rounded-xl bg-[#161826] border border-white/5 hover:border-amber-400/30 flex items-center gap-2.5 cursor-pointer transition-colors group"
                      >
                        <img
                          src={getImageUrl(movie.poster_path, 'w200')}
                          alt=""
                          className="w-8 h-12 object-cover rounded-lg bg-neutral-800 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=100&auto=format&fit=crop';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                            {movie.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              {movie.vote_average?.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {watchlist.length > 5 && (
                      <Link
                        to="/watchlist"
                        onClick={() => setIsOpen(false)}
                        className="block text-center py-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-white/[0.02] rounded-xl"
                      >
                        + {watchlist.length - 5} more saved movies
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. SECURITY & PASSWORD RESET TAB */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Update or reset your password securely here. (Min. 6 characters).</span>
                </div>

                {securityStatus?.error && (
                  <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-[11px] text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{securityStatus.error}</span>
                  </div>
                )}

                {securityStatus?.success && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{securityStatus.success}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#161826] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="e.g. 77030@Himword"
                    className="w-full bg-[#161826] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl transition-all shadow"
                >
                  Save New Password
                </button>
              </form>
            )}
          </div>

          {/* Footer with Sign Out */}
          <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Full Profile Dashboard
            </Link>

            <button
              id="profile-logout-btn"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
