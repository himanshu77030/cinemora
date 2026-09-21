import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  History,
  Bookmark,
  KeyRound,
  Shield,
  Sparkles,
  Trash2,
  ExternalLink,
  Film,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  Settings,
  Tv,
  LogOut,
  Play
} from 'lucide-react';
import { useAuth, AVATAR_OPTIONS } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/tmdb';

export const Profile: React.FC = () => {
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

  const { watchlist, removeFromWatchlist } = useWatchlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'saved' | 'security'>('overview');

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityStatus, setSecurityStatus] = useState<{ error?: string; success?: string } | null>(null);

  // If not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-[#0f111c] border border-white/10 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl">
            🎬
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white font-display">Sign In to Your Profile</h2>
            <p className="text-sm text-neutral-400">
              Access your personalized watch history, saved movies, custom preferences, and account security.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Sign In to Cinemora
            </button>
            <Link
              to="/"
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 transition-all inline-block text-center"
            >
              Browse Movies as Guest
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name: name.trim() });
    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 2500);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);

    if (newPassword !== confirmPassword) {
      setSecurityStatus({ error: 'New passwords do not match.' });
      return;
    }

    const res = await changePassword(currentPassword, newPassword);
    if (!res.success) {
      setSecurityStatus({ error: res.error || 'Password update failed.' });
    } else {
      setSecurityStatus({ success: 'Your password was successfully updated!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Profile Header Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121422] via-[#0f111c] to-[#161828] border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black text-4xl sm:text-5xl flex items-center justify-center shadow-xl shadow-amber-500/20">
              {user.avatar || '🎬'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                  {user.role} Pass
                </span>
              </div>
              <p className="text-sm text-neutral-400">{user.email}</p>
              <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1">
                <span>Member since {user.joinedDate}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Cinemora Active</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl font-black text-amber-400 font-display">
              {watchlist.length}
            </span>
            <p className="text-xs text-neutral-400 mt-0.5">Saved to Watchlist</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl font-black text-blue-400 font-display">
              {watchHistory.length}
            </span>
            <p className="text-xs text-neutral-400 mt-0.5">Watched in History</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl font-black text-emerald-400 font-display">Free</span>
            <p className="text-xs text-neutral-400 mt-0.5">Streaming Tier</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl font-black text-purple-400 font-display">1080p</span>
            <p className="text-xs text-neutral-400 mt-0.5">Playback Quality</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Watch History ({watchHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Movies ({watchlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PROFILE DETAILS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-[#0f111c] border border-white/10 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Personal Information</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161826] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Registered Email (Fixed)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-400 cursor-not-allowed"
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Select Profile Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateProfile({ avatar: opt.emoji })}
                      className={`p-3 rounded-2xl text-2xl flex items-center justify-center border transition-all ${
                        user.avatar === opt.emoji
                          ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-md'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                      title={opt.label}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all"
              >
                Save Profile Changes
              </button>

              {saveProfileSuccess && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </p>
              )}
            </form>
          </div>

          {/* Streaming & Free Watch Preferences */}
          <div className="rounded-3xl bg-[#0f111c] border border-white/10 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Tv className="w-5 h-5 text-amber-400" />
              <span>Streaming & Playback Preferences</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Default Free Provider</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Filter free movies prioritizing your preferred platform.
                  </p>
                </div>
                <select
                  value={user.preferences?.preferredPlatform || 'All'}
                  onChange={(e) =>
                    updateProfile({
                      preferences: {
                        ...user.preferences,
                        preferredPlatform: e.target.value
                      }
                    })
                  }
                  className="bg-[#161826] border border-white/10 text-xs text-amber-300 font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                >
                  <option value="All">All Providers</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Tubi">Tubi</option>
                  <option value="Pluto TV">Pluto TV</option>
                  <option value="Internet Archive">Internet Archive</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Autoplay Trailers</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Stream official trailer previews automatically in hero banner.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={user.preferences?.autoplayTrailers ?? true}
                  onChange={(e) =>
                    updateProfile({
                      preferences: {
                        ...user.preferences,
                        autoplayTrailers: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Cinemora VIP Benefits Included</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Your free account allows unlimited bookmarking, ad-free UI browsing, real-time TMDB
                  trending data, and direct access to legal full movies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WATCH HISTORY */}
      {activeTab === 'history' && (
        <div className="rounded-3xl bg-[#0f111c] border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Your Watch History</h3>
              <p className="text-xs text-neutral-400">
                Titles you have inspected, played, or streamed on Cinemora.
              </p>
            </div>
            {watchHistory.length > 0 && (
              <button
                onClick={clearWatchHistory}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>

          {watchHistory.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 space-y-3">
              <History className="w-12 h-12 mx-auto text-neutral-600" />
              <p className="text-base font-semibold text-white">Your watch history is empty</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Explore movies, watch full free titles, or stream trailers to automatically record your history.
              </p>
              <Link
                to="/free-movies"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs mt-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Explore Free Movies</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchHistory.map((item) => (
                <div
                  key={item.movie.id}
                  className="rounded-2xl bg-[#161826] border border-white/5 hover:border-amber-400/40 transition-all overflow-hidden flex gap-3 p-3 group relative"
                >
                  <img
                    src={getImageUrl(item.movie.poster_path, 'w200')}
                    alt=""
                    className="w-16 h-24 object-cover rounded-xl bg-neutral-800 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop';
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/movie/${item.movie.id}`}
                        className="text-sm font-bold text-white hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {item.movie.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {item.movie.vote_average?.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{item.movie.release_date?.split('-')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.watchedAt).toLocaleDateString()}</span>
                      </span>

                      <button
                        onClick={() => removeFromWatchHistory(item.movie.id)}
                        className="text-neutral-400 hover:text-red-400 p-1"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED MOVIES (WATCHLIST) */}
      {activeTab === 'saved' && (
        <div className="rounded-3xl bg-[#0f111c] border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Saved to Watchlist</h3>
              <p className="text-xs text-neutral-400">
                You have {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved to your account.
              </p>
            </div>
            <Link
              to="/watchlist"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all"
            >
              <span>Manage Full Watchlist</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 space-y-3">
              <Bookmark className="w-12 h-12 mx-auto text-neutral-600" />
              <p className="text-base font-semibold text-white">Your watchlist is empty</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Click the bookmark icon on any movie to save it to your personal Cinemora library.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs mt-2"
              >
                <span>Browse Movies</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map((movie) => (
                <div
                  key={movie.id}
                  className="rounded-2xl bg-[#161826] border border-white/5 hover:border-amber-400/40 transition-all overflow-hidden flex gap-3 p-3 group relative"
                >
                  <img
                    src={getImageUrl(movie.poster_path, 'w200')}
                    alt=""
                    className="w-16 h-24 object-cover rounded-xl bg-neutral-800 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop';
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/movie/${movie.id}`}
                        className="text-sm font-bold text-white hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {movie.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {movie.vote_average?.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{movie.release_date?.split('-')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                      <Link
                        to={`/movie/${movie.id}`}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <span>View Details</span>
                      </Link>

                      <button
                        onClick={() => removeFromWatchlist(movie.id)}
                        className="text-neutral-400 hover:text-red-400 p-1"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SECURITY & PASSWORD RESET */}
      {activeTab === 'security' && (
        <div className="max-w-xl mx-auto rounded-3xl bg-[#0f111c] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Account Password & Security</h3>
              <p className="text-xs text-neutral-400">
                Change your Cinemora account password (e.g. set to your preferred password like 77030@Himword).
              </p>
            </div>
          </div>

          {securityStatus?.error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{securityStatus.error}</span>
            </div>
          )}

          {securityStatus?.success && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{securityStatus.success}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#161826] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (e.g. 77030@Himword)"
                className="w-full bg-[#161826] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#161826] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Update & Save Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
