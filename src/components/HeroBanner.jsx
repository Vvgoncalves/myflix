import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Star, Volume2, ChevronRight, ShieldAlert } from 'lucide-react';
import { getBackdropUrl } from '../services/api';

export default function HeroBanner({
  featuredItems = [],
  onPlay,
  onInfo,
  onToggleFavorite,
  isFavorite
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner every 8 seconds if user doesn't interact
  useEffect(() => {
    if (!featuredItems || featuredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredItems]);

  if (!featuredItems || featuredItems.length === 0) {
    return (
      <div className="relative h-[65vh] min-h-[480px] bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-wine-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const current = featuredItems[currentIndex] || featuredItems[0];
  const favorited = isFavorite(current.id);

  return (
    <div className="relative h-[75vh] min-h-[540px] max-h-[800px] w-full overflow-hidden select-none">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          key={current.id}
          src={getBackdropUrl(current.backdrop_path, 'original')}
          alt={current.title}
          className="w-full h-full object-cover object-top filter brightness-75 transform scale-105 transition-all duration-1000"
        />

        {/* Cinematic Gradient Overlays */}
        {/* Left darkening gradient for high-contrast text */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent w-full md:w-3/4 z-10" />
        {/* Bottom smooth fade to content section */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent z-10" />
        {/* Top subtle fade for navbar readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-950/90 to-transparent z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 md:pb-20">
        <div className="max-w-2xl space-y-4 animate-fadeIn">
          {/* Top highlight badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-wine-600 text-white shadow-wine-glow">
              Destaque
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-dark-800/80 text-dark-200 border border-dark-700">
              {current.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {current.vote_average}
            </span>
            <span className="text-xs text-dark-300 font-medium">
              {current.release_date?.substring(0, 4)}
            </span>
            <span className="px-1.5 py-0.5 text-[11px] font-bold rounded bg-dark-800 text-dark-200 border border-dark-700">
              {current.age_rating || '14+'}
            </span>
            <span className="px-1.5 py-0.5 text-[11px] font-bold rounded bg-dark-850/90 text-dark-300 border border-dark-700">
              4K HDR
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-heading">
            {current.title}
          </h1>

          {/* Genres row */}
          {current.genres && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-dark-300 font-medium">
              {current.genres.slice(0, 3).map((genre, idx) => (
                <React.Fragment key={genre}>
                  <span>{genre}</span>
                  {idx < Math.min(current.genres.length - 1, 2) && (
                    <span className="text-dark-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Overview text */}
          <p className="text-dark-200 text-sm sm:text-base line-clamp-3 leading-relaxed max-w-xl font-normal text-slate-200/90">
            {current.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onPlay(current)}
              className="wine-gradient-btn px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2.5 text-sm sm:text-base shadow-lg shadow-wine-900/50 hover:shadow-wine-glow transform hover:-translate-y-0.5 cursor-pointer active:scale-95 transition-all duration-200"
            >
              <Play className="w-5 h-5 fill-white" />
              Assistir Agora
            </button>

            <button
              onClick={() => onInfo(current)}
              className="px-5 py-3 rounded-xl font-semibold text-white bg-dark-800/80 hover:bg-dark-700 border border-dark-700/80 backdrop-blur-md flex items-center gap-2 text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Info className="w-5 h-5 text-dark-300" />
              Mais Detalhes
            </button>

            <button
              onClick={() => onToggleFavorite(current)}
              title={favorited ? 'Remover da minha lista' : 'Adicionar à minha lista'}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                favorited
                  ? 'bg-wine-900/60 border-wine-600 text-wine-400'
                  : 'bg-dark-800/80 border-dark-700/80 text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              {favorited ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Banner Indicators (Dots) */}
      {featuredItems.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          {featuredItems.slice(0, 5).map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 bg-wine-500 shadow-wine-glow'
                  : 'w-2 bg-dark-600 hover:bg-dark-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

