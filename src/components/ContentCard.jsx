import React, { useState } from 'react';
import { Play, Info, Heart, Star } from 'lucide-react';
import { getImageUrl } from '../services/api';

export default function ContentCard({
  item,
  onPlay,
  onInfo,
  onToggleFavorite,
  isFavorite
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const favorited = isFavorite(item.id);

  const categoryBadgeColors = {
    filme: 'bg-dark-800 text-dark-200 border-dark-700',
    serie: 'bg-wine-950 text-wine-300 border-wine-800/60',
    anime: 'bg-dark-800 text-wine-400 border-dark-700',
    desenho: 'bg-dark-800 text-dark-200 border-dark-700'
  };

  const posterSrc = imageError
    ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80'
    : getImageUrl(item.poster_path, 'w500');

  return (
    <div className="group relative flex-shrink-0 w-36 sm:w-44 md:w-52 transition-all duration-300 ease-out select-none">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-dark-900 border border-dark-800 group-hover:border-wine-600/70 transition-all duration-300 shadow-md group-hover:shadow-card-hover group-hover:-translate-y-1.5 cursor-pointer card-shine">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-dark-850 animate-pulse flex items-center justify-center">
            <span className="text-dark-600 text-xs font-semibold">Carregando...</span>
          </div>
        )}

        {/* Poster Image */}
        <img
          src={posterSrc}
          alt={item.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Static Badges on Card */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border backdrop-blur-md ${
              categoryBadgeColors[item.category] || categoryBadgeColors.filme
            }`}
          >
            {item.category}
          </span>
          {item.is_unreleased && (
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/90 text-black shadow">
              Em Breve
            </span>
          )}
        </div>

        {/* Rating Badge top-right */}
        <div className="absolute top-2 right-2 z-10">
          <span className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-dark-950/80 backdrop-blur-md text-amber-400 border border-dark-800">
            <Star className="w-3 h-3 fill-amber-400" />
            {item.vote_average || '7.5'}
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-dark-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-20">
          {/* Top row in overlay */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item);
              }}
              title={favorited ? 'Remover da Lista' : 'Adicionar à Lista'}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                favorited
                  ? 'bg-wine-600 text-white'
                  : 'bg-dark-900/80 text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Center Play Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(item);
              }}
              className="w-12 h-12 rounded-full wine-gradient-btn flex items-center justify-center text-white shadow-wine-glow transform group-hover:scale-105 active:scale-95 transition-transform"
              title="Assistir agora"
            >
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </button>
          </div>

          {/* Bottom info button & metadata */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-dark-300 font-medium">
              <span>{item.release_date?.substring(0, 4) || '2024'}</span>
              <span className="text-[10px] uppercase font-bold text-dark-400 border border-dark-700 px-1 rounded">
                {item.duration || (item.type === 'movie' ? 'HD' : `${item.seasons_count || 1}T`)}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInfo(item);
              }}
              className="w-full py-1.5 px-2 rounded-lg bg-dark-800/90 hover:bg-dark-750 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors border border-dark-700"
            >
              <Info className="w-3.5 h-3.5" /> Detalhes
            </button>
          </div>
        </div>
      </div>

      {/* Title & subtitle below card */}
      <div className="mt-2.5 px-0.5">
        <h3
          onClick={() => onInfo(item)}
          className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-wine-400 transition-colors cursor-pointer"
          title={item.title}
        >
          {item.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-dark-400 mt-0.5">
          <span className="truncate max-w-[70%]">
            {item.genres ? item.genres.slice(0, 2).join(', ') : 'Geral'}
          </span>
          <span className="font-medium text-dark-300">
            {item.release_date?.substring(0, 4)}
          </span>
        </div>
      </div>
    </div>
  );
}

