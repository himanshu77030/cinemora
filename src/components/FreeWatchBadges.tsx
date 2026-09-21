import React from 'react';
import { ExternalLink, Play, Sparkles } from 'lucide-react';
import { FreeWatchSource, FreePlatformName } from '../types';

interface FreeWatchBadgesProps {
  sources: FreeWatchSource[];
  title?: string;
  compact?: boolean;
  onPlayEmbed?: (embedId: string, title: string) => void;
}

export const FreeWatchBadges: React.FC<FreeWatchBadgesProps> = ({
  sources,
  title,
  compact = false,
  onPlayEmbed
}) => {
  const getPlatformStyle = (platform: FreePlatformName) => {
    switch (platform) {
      case 'YouTube':
        return {
          bg: 'bg-red-600/15 hover:bg-red-600/25 border-red-500/30 text-red-400 hover:text-red-300',
          badge: 'bg-red-600 text-white',
          dot: 'bg-red-500',
          label: 'YouTube'
        };
      case 'Tubi':
        return {
          bg: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-400 hover:text-amber-300',
          badge: 'bg-amber-500 text-black font-extrabold',
          dot: 'bg-amber-400',
          label: 'Tubi TV'
        };
      case 'Pluto TV':
        return {
          bg: 'bg-yellow-500/15 hover:bg-yellow-500/25 border-yellow-500/30 text-yellow-400 hover:text-yellow-300',
          badge: 'bg-yellow-400 text-black font-extrabold',
          dot: 'bg-yellow-400',
          label: 'Pluto TV'
        };
      case 'Plex':
        return {
          bg: 'bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/30 text-orange-400 hover:text-orange-300',
          badge: 'bg-orange-500 text-black font-extrabold',
          dot: 'bg-orange-400',
          label: 'Plex'
        };
      case 'Internet Archive':
        return {
          bg: 'bg-blue-500/15 hover:bg-blue-500/25 border-blue-500/30 text-blue-400 hover:text-blue-300',
          badge: 'bg-blue-600 text-white',
          dot: 'bg-blue-400',
          label: 'Archive.org'
        };
      case 'Freevee':
        return {
          bg: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-400 hover:text-emerald-300',
          badge: 'bg-emerald-500 text-black font-bold',
          dot: 'bg-emerald-400',
          label: 'Freevee'
        };
      case 'Netflix':
        return {
          bg: 'bg-red-700/15 hover:bg-red-700/25 border-red-600/30 text-red-400 hover:text-red-300',
          badge: 'bg-red-700 text-white font-bold',
          dot: 'bg-red-600',
          label: 'Netflix'
        };
      default:
        return {
          bg: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
          badge: 'bg-white text-black',
          dot: 'bg-white',
          label: platform
        };
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {sources.slice(0, 3).map((source, index) => {
          const style = getPlatformStyle(source.platform);
          return (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all ${style.bg}`}
              title={`Watch on ${source.platform} (${source.type})`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              <span>{source.platform}</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Available Free On</span>
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20">
          100% Legal & Free
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {sources.map((source, index) => {
          const style = getPlatformStyle(source.platform);
          const hasEmbed = !!source.embedId && !!onPlayEmbed;

          return (
            <div
              key={index}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${style.bg}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    {source.platform}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 font-medium">
                    {source.type}
                  </span>
                </div>
                {source.channelOrHost && (
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {source.channelOrHost}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {hasEmbed && (
                  <button
                    onClick={() => onPlayEmbed(source.embedId!, title || 'Movie')}
                    className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow transition-colors"
                    title="Play Video inside Cinemora"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch</span>
                  </button>
                )}

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-white/10"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3 text-neutral-300" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
