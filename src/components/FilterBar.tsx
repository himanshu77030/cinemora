import React from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import { FilterOptions } from '../types';
import { TMDB_GENRES } from '../data/genres';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onReset: () => void;
  totalResults?: number;
}

const YEARS = [
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2015',
  '2010',
  '2000',
  '1990',
  '1980',
  '1970'
];

const RATINGS = [
  { label: 'Any Rating', value: 0 },
  { label: '⭐ 8.0 & above', value: 8 },
  { label: '⭐ 7.0 & above', value: 7 },
  { label: '⭐ 6.0 & above', value: 6 }
];

const LANGUAGES = [
  { label: 'All Languages', value: '' },
  { label: 'English', value: 'en' },
  { label: 'Korean', value: 'ko' },
  { label: 'Japanese', value: 'ja' },
  { label: 'French', value: 'fr' },
  { label: 'Spanish', value: 'es' },
  { label: 'German', value: 'de' }
];

const SORT_OPTIONS = [
  { label: 'Popularity (High to Low)', value: 'popularity.desc' },
  { label: 'Top Rated (Highest First)', value: 'vote_average.desc' },
  { label: 'Release Date (Newest)', value: 'primary_release_date.desc' },
  { label: 'Title (A-Z)', value: 'title.asc' }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults
}) => {
  const hasActiveFilters = Boolean(
    filters.genreId || filters.year || (filters.minRating && filters.minRating > 0) || filters.language
  );

  return (
    <div className="bg-[#12141f] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top Filter Bar Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Filters & Sort</span>
          {typeof totalResults === 'number' && (
            <span className="text-xs text-neutral-400 font-normal ml-2">
              ({totalResults} titles found)
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Select Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Genre Select */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Genre
          </label>
          <div className="relative">
            <select
              value={filters.genreId || ''}
              onChange={(e) => onFilterChange({ genreId: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full appearance-none bg-black/40 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-500/70"
            >
              <option value="">All Genres</option>
              {TMDB_GENRES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Release Year */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Year
          </label>
          <div className="relative">
            <select
              value={filters.year || ''}
              onChange={(e) => onFilterChange({ year: e.target.value || undefined })}
              className="w-full appearance-none bg-black/40 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-500/70"
            >
              <option value="">Any Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Rating
          </label>
          <div className="relative">
            <select
              value={filters.minRating || 0}
              onChange={(e) => onFilterChange({ minRating: Number(e.target.value) || undefined })}
              className="w-full appearance-none bg-black/40 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-500/70"
            >
              {RATINGS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Language */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Language
          </label>
          <div className="relative">
            <select
              value={filters.language || ''}
              onChange={(e) => onFilterChange({ language: e.target.value || undefined })}
              className="w-full appearance-none bg-black/40 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-500/70"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sort Option */}
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Sort By
          </label>
          <div className="relative">
            <select
              value={filters.sortBy || 'popularity.desc'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="w-full appearance-none bg-black/40 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-500/70"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
