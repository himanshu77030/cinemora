import React, { useEffect } from 'react';
import { X, Play, AlertCircle } from 'lucide-react';
import { MovieVideo } from '../types';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: MovieVideo | null;
  movieTitle: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  video,
  movieTitle
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="trailer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="trailer-modal-content"
        className="relative w-full max-w-4xl bg-[#12141d] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161924]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-wide truncate max-w-md">
                {video ? video.name : `Trailer - ${movieTitle}`}
              </h3>
              <p className="text-xs text-neutral-400">{movieTitle}</p>
            </div>
          </div>
          <button
            id="close-trailer-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {video && video.site.toLowerCase() === 'youtube' && video.key ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center gap-3 p-8 text-center text-neutral-400">
              <AlertCircle className="w-10 h-10 text-amber-500/70" />
              <p className="text-sm sm:text-base font-medium text-white">
                Trailer currently unavailable for this title
              </p>
              <p className="text-xs text-neutral-400 max-w-sm">
                Check back soon or explore more details about {movieTitle}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
