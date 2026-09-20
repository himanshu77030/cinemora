import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, History } from 'lucide-react';
import { setDocumentTitle } from '../utils/seo';

interface DecadeGroup {
  name: string;
  years: number[];
  tagline: string;
  sampleMovies: string;
}

const DECADES: DecadeGroup[] = [
  {
    name: '2020s',
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
    tagline: 'The Modern Cinematic Renaissance & Multiversal Epics',
    sampleMovies: 'Dune: Part Two, Oppenheimer, Everything Everywhere All at Once'
  },
  {
    name: '2010s',
    years: [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
    tagline: 'Golden Era of Sci-Fi, Peak Visual Effects, and Auteur Prestige',
    sampleMovies: 'Interstellar, Inception, Parasite, Blade Runner 2049'
  },
  {
    name: '2000s',
    years: [2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000],
    tagline: 'Monumental Blockbusters, Groundbreaking CGI, and Iconic Trilogies',
    sampleMovies: 'The Dark Knight, Spirited Away, The Lord of the Rings, Gladiator'
  },
  {
    name: '1990s',
    years: [1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990],
    tagline: 'The Definitive Decade for Cinematic Masterpieces & Independent Film',
    sampleMovies: 'Schindler’s List, Pulp Fiction, The Shawshank Redemption, The Matrix'
  },
  {
    name: '1980s',
    years: [1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980],
    tagline: 'High-Octane Action, Practical FX Legends, and Sci-Fi Cult Classics',
    sampleMovies: 'Blade Runner, Aliens, The Shining, Back to the Future'
  },
  {
    name: '1970s',
    years: [1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970],
    tagline: 'New Hollywood Revolution, Gritty Realism, and Auteur Breakthroughs',
    sampleMovies: 'The Godfather, Apocalypse Now, Star Wars, Taxi Driver'
  }
];

export const Years: React.FC = () => {
  const [activeDecade, setActiveDecade] = useState('2020s');

  useEffect(() => {
    setDocumentTitle(
      'Movies by Year & Decade | Cinemora',
      'Explore movies through time. Browse film releases and top-rated masterworks organized by year and decade.'
    );
  }, []);

  const selectedDecade = DECADES.find((d) => d.name === activeDecade) || DECADES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold">
          <History className="w-4 h-4" />
          <span>Timeline of Cinema</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
          Movies by Year & Decade
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Journey through film history. Select any year or decade to discover the highest-rated releases and cultural milestones.
        </p>
      </div>

      {/* Decade Filter Pills */}
      <div className="flex flex-wrap gap-2.5 border-b border-white/5 pb-4">
        {DECADES.map((d) => (
          <button
            key={d.name}
            onClick={() => setActiveDecade(d.name)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeDecade === d.name
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#13151f] hover:bg-white/10 text-neutral-300 border border-white/5'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Decade Spotlight Box */}
      <div className="bg-[#12141f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Decade Profile
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            The {selectedDecade.name}
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 mt-1">
            {selectedDecade.tagline}
          </p>
        </div>

        <div className="text-xs sm:text-sm text-neutral-400 flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-semibold text-white">Landmark films:</span>
          <span>{selectedDecade.sampleMovies}</span>
        </div>

        {/* Year Buttons Grid */}
        <div className="pt-4 border-t border-white/5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Select a Specific Year:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {selectedDecade.years.map((year) => (
              <Link
                key={year}
                to={`/year/${year}`}
                className="group p-4 rounded-xl bg-black/40 hover:bg-amber-500 border border-white/5 hover:border-amber-400 text-center transition-all duration-200 shadow-md"
              >
                <span className="block text-lg font-bold text-white group-hover:text-black transition-colors font-display">
                  {year}
                </span>
                <span className="text-[11px] text-neutral-400 group-hover:text-black/80 transition-colors flex items-center justify-center gap-1 mt-1 font-medium">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access to Recent Top Years */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Trending Year Hubs</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[2025, 2024, 2023].map((yr) => (
            <Link
              key={yr}
              to={`/year/${yr}`}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#141724] to-[#0f1118] border border-white/10 hover:border-amber-500/40 p-5 transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase">Top Catalog</span>
                <h4 className="text-2xl font-black text-white font-display">Best of {yr}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Top-rated and biggest box office releases</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-black flex items-center justify-center text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
