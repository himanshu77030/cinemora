import React, { useState } from 'react';
import { X, Key, CheckCircle2, Info, ExternalLink } from 'lucide-react';
import { getApiKey, setCustomApiKey, hasApiKey } from '../services/tmdb';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(apiKeyInput);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onKeyUpdated?.();
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKeyInput('');
    setCustomApiKey('');
    onKeyUpdated?.();
  };

  return (
    <div
      id="api-key-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="api-key-modal-content"
        className="relative w-full max-w-md bg-[#13151f] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">TMDB API Configuration</h3>
              <p className="text-xs text-neutral-400">Manage your movie data source</p>
            </div>
          </div>
          <button
            id="close-apikey-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex gap-3 text-xs text-neutral-300">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            Cinemora provides rich curated movie data out of the box. To unlock live unlimited queries from TMDB's catalog of 800,000+ titles, provide your free TMDB v3 API key.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              TMDB API Key (v3 auth)
            </label>
            <input
              id="tmdb-api-key-input"
              type="password"
              placeholder="e.g. 1a2b3c4d5e6f7g8h9..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 hover:underline"
            >
              <span>Get a free key at TMDB</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {hasApiKey() && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                Reset to default
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-apikey-btn"
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Saved!</span>
                </>
              ) : (
                'Save Key'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
