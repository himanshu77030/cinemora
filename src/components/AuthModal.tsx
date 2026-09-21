import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Film,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    resetPassword,
    continueAsGuest
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleSwitchToForgot = () => {
    resetForm();
    openAuthModal('forgot');
  };

  const handleSwitchToLogin = () => {
    resetForm();
    openAuthModal('login');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in.');
      } else {
        closeAuthModal();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to reset password.');
      } else {
        setSuccessMessage(res.message);
        setTimeout(() => {
          handleSwitchToLogin();
        }, 1600);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setError(null);
    setLoading(true);
    setEmail('himanshu7703077046@gmail.com');
    setPassword('77030@Himword');
    try {
      const res = await login('himanshu7703077046@gmail.com', '77030@Himword');
      if (res.success) {
        closeAuthModal();
      } else {
        setError(res.error || 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Dialog Card */}
      <div
        id="auth-modal-dialog"
        className="relative w-full max-w-md rounded-3xl bg-[#0f111c] border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/5 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent">
          {/* Close button (Dismisses as Guest) */}
          <button
            id="auth-modal-close-btn"
            onClick={continueAsGuest}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Continue as Guest"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center shadow-lg font-black text-lg shadow-amber-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                Cinem<span className="text-amber-400">ora</span>
              </span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
                Member Hub
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white font-display mt-1">
            {authModalTab === 'login' ? 'Sign In to Cinemora' : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {authModalTab === 'login'
              ? 'Enter your credentials to access watch history, saved movies, and user settings.'
              : 'Enter your registered email and create a new secure password.'}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Error Message banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message banner */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {authModalTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="himanshu7703077046@gmail.com"
                    className="w-full bg-[#161826] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Password</label>
                  <button
                    type="button"
                    onClick={handleSwitchToForgot}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#161826] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Fast 1-Click Demo Login */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>One-Click Quick Sign In (Himanshu)</span>
                </button>
              </div>
            </form>
          ) : (
            /* 2. RESET PASSWORD FORM */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="himanshu7703077046@gmail.com"
                    className="w-full bg-[#161826] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  New Password (e.g. 77030@Himword)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-new-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#161826] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-confirm-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#161826] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                id="reset-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <span>Saving New Password...</span> : <span>Reset & Save Password</span>}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="text-xs text-neutral-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* Continue as Guest (Clear action so visitors can explore freely) */}
          <div className="pt-3 border-t border-white/5 flex flex-col items-center gap-1.5 text-center">
            <button
              id="auth-continue-guest-btn"
              type="button"
              onClick={continueAsGuest}
              className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors underline decoration-dotted underline-offset-4"
            >
              Continue as Guest (No login required)
            </button>
            <p className="text-[11px] text-neutral-500">
              Browse movies, search titles, watch trailers, and stream free anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
