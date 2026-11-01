import React, { useState, useEffect } from 'react';
import { X, Play, Heart, Star, Calendar, Clock, Film, Tv, Users, Clapperboard } from 'lucide-react';
import { getBackdropUrl, getImageUrl, api } from '../services/api';

export default function DetailModal({
  item,
  onClose,
  onPlay,
  onToggleFavorite,
  isFavorite,
  onSelectItem
}) {
  const [details, setDetails] = useState(item);
  const [loading, setLoading] = useState(true);
  const favorited = isFavorite(item.id);

  useEffect(() => {
    let isMounted = true;
    const fetchFullDetails = async () => {
      setLoading(true);
      try {
        const full = await api.getItemDetails(item.id, item.type);
        if (isMounted && full) {
          setDetails(full);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFullDetails();
    return () => {
      isMounted = false;
    };
  }, [item.id, item.type]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-dark-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-dark-950/80 hover:bg-wine-600 text-white border border-dark-700 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop in Modal */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={getBackdropUrl(details.backdrop_path, 'original')}
            alt={details.title}
            className="w-full h-full object-cover object-top filter brightness-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-transparent to-transparent w-1/2" />

          {/* Quick Play CTA inside backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5 z-20">
            <img
              src={getImageUrl(details.poster_path, 'w342')}
              alt={details.title}
              className="hidden sm:block w-32 md:w-40 aspect-[2/3] object-cover rounded-xl shadow-2xl border-2 border-dark-750 flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-wine-600 text-white shadow-wine-glow">
                  {details.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-dark-950/80 px-2 py-0.5 rounded border border-dark-750">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {details.vote_average}
                </span>
                <span className="text-xs text-dark-300 font-medium bg-dark-950/80 px-2 py-0.5 rounded border border-dark-750">
                  {details.release_date?.substring(0, 4)}
                </span>
                <span className="text-xs text-dark-300 font-medium bg-dark-950/80 px-2 py-0.5 rounded border border-dark-750">
                  {details.duration}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
                {details.title}
              </h2>
              {details.original_title && details.original_title !== details.title && (
                <p className="text-xs text-dark-400 italic">
                  Título original: {details.original_title}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Action Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                onClose();
                onPlay(details);
              }}
              className="wine-gradient-btn px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-wine-900/40 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              Assistir no Player
            </button>

            <button
              onClick={() => onToggleFavorite(details)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                favorited
                  ? 'bg-wine-900/60 border-wine-600 text-wine-300'
                  : 'bg-dark-800 border-dark-700 text-dark-200 hover:text-white hover:bg-dark-750'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-wine-400 text-wine-400' : ''}`} />
              {favorited ? 'Na Minha Lista' : 'Adicionar à Lista'}
            </button>
          </div>

          {/* Genres Chips */}
          {details.genres && details.genres.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-dark-400 font-semibold uppercase">Gêneros:</span>
              {details.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-800 text-dark-200 border border-dark-750"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Overview text */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sinopse</h3>
            <p className="text-dark-200 text-sm md:text-base leading-relaxed font-normal">
              {details.overview || 'Sinopse não informada.'}
            </p>
          </div>

          {/* Cast & Details Info Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-dark-800 text-xs sm:text-sm">
            {details.cast && details.cast.length > 0 && (
              <div>
                <span className="text-dark-400 block font-semibold mb-1">Elenco Principal:</span>
                <span className="text-dark-200">{details.cast.slice(0, 6).join(', ')}</span>
              </div>
            )}
            {details.director && (
              <div>
                <span className="text-dark-400 block font-semibold mb-1">Direção / Criação:</span>
                <span className="text-dark-200">{details.director}</span>
              </div>
            )}
            <div>
              <span className="text-dark-400 block font-semibold mb-1">Tipo de Conteúdo:</span>
              <span className="text-dark-200 capitalize">
                {details.type === 'movie' ? 'Filme de Longa-Metragem' : 'Série de TV / Episódios'}
              </span>
            </div>
            <div>
              <span className="text-dark-400 block font-semibold mb-1">Player Compatível:</span>
              <span className="text-wine-400 font-semibold">SuperFlix API Embed (TMDB #{details.id})</span>
            </div>
          </div>

          {/* Similar Items */}
          {details.similar && details.similar.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-dark-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Títulos Semelhantes
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {details.similar.slice(0, 6).map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectItem(sim)}
                    className="group cursor-pointer space-y-1.5"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-dark-800 border border-dark-750 group-hover:border-wine-500 transition-colors">
                      <img
                        src={getImageUrl(sim.poster_path, 'w185')}
                        alt={sim.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs text-white font-medium truncate group-hover:text-wine-400">
                      {sim.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

