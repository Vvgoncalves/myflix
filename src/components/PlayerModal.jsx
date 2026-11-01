import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  ExternalLink,
  SkipForward,
  Star,
  ChevronDown,
  Monitor,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';
import { getPlayerUrl, SERVERS, api } from '../services/api';

export default function PlayerModal({
  item,
  initialSeason = 1,
  initialEpisode = 1,
  onClose,
  onSelectItem
}) {
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0].id);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);

  const isMovie = item.type === 'movie';
  const totalSeasons = item.seasons_count || 1;

  const releaseYear = item.release_year || parseInt(item.release_date?.substring(0, 4) || '2024', 10);
  const isFutureRelease = releaseYear > new Date().getFullYear();

  // Load episodes when season changes for TV/Anime/Cartoon
  useEffect(() => {
    if (isMovie) return;

    let isMounted = true;
    const fetchEpisodes = async () => {
      setLoadingEpisodes(true);
      try {
        const eps = await api.getSeasonEpisodes(item.id, selectedSeason);
        if (isMounted) {
          setEpisodes(eps);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingEpisodes(false);
      }
    };

    fetchEpisodes();
    return () => {
      isMounted = false;
    };
  }, [item.id, selectedSeason, isMovie]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const playerUrl = getPlayerUrl(item, selectedSeason, selectedEpisode, selectedServer);

  const handleNextEpisode = () => {
    if (episodes.length > selectedEpisode) {
      setSelectedEpisode(selectedEpisode + 1);
      setPlayerLoading(true);
    } else if (selectedSeason < totalSeasons) {
      setSelectedSeason(selectedSeason + 1);
      setSelectedEpisode(1);
      setPlayerLoading(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-dark-950/95 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div
        className={`relative w-full ${
          theaterMode ? 'max-w-7xl' : 'max-w-5xl'
        } bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl overflow-hidden my-auto transition-all duration-300 flex flex-col`}
      >
        {/* Unreleased Warning Banner */}
        {isFutureRelease && (
          <div className="bg-amber-950/90 border-b border-amber-600/40 p-3 px-4 sm:px-6 flex items-center gap-3 text-amber-200 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <strong className="text-white font-bold">Título com Lançamento Previsto para {releaseYear}:</strong>{' '}
              Este conteúdo ainda não estreou oficialmente nos cinemas ou na TV. Nenhum reprodutor externo possui transmissão antes do lançamento oficial.
            </div>
          </div>
        )}

        {/* Player Header Bar */}
        <div className="px-4 py-3 sm:px-6 bg-dark-850 border-b border-dark-750 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-wine-500 animate-pulse shadow-wine-glow flex-shrink-0" />
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold text-white truncate font-heading">
                {item.title}
                {!isMovie && (
                  <span className="text-wine-400 font-semibold ml-2">
                    T{selectedSeason}:E{selectedEpisode}
                  </span>
                )}
              </h2>
              <p className="text-xs text-dark-400 truncate">
                {isMovie ? 'Filme Completo' : (episodes[selectedEpisode - 1]?.name || `Episódio ${selectedEpisode}`)}
              </p>
            </div>
          </div>

          {/* Controls: Server switcher, Theater toggle, Close */}
          <div className="flex items-center gap-2">
            {/* Server Selector */}
            <div className="relative">
              <select
                value={selectedServer}
                onChange={(e) => {
                  setSelectedServer(e.target.value);
                  setPlayerLoading(true);
                }}
                className="bg-dark-800 text-xs text-dark-200 border border-dark-700 rounded-lg px-2.5 py-1.5 pr-7 appearance-none cursor-pointer hover:border-wine-500 focus:outline-none"
              >
                {SERVERS.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-dark-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Theater Mode */}
            <button
              onClick={() => setTheaterMode(!theaterMode)}
              title={theaterMode ? 'Modo Normal' : 'Modo Teatro'}
              className="hidden sm:flex p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-dark-300 hover:text-white border border-dark-700 transition-colors"
            >
              <Monitor className="w-4 h-4" />
            </button>

            {/* Open in new tab fallback */}
            <a
              href={playerUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir player em nova aba"
              className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-dark-300 hover:text-white border border-dark-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Modal */}
            <button
              onClick={onClose}
              title="Fechar player"
              className="p-1.5 rounded-lg bg-wine-900/60 hover:bg-wine-600 text-white border border-wine-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Iframe Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {/* Loading Shimmer / Spinner */}
          {playerLoading && (
            <div className="absolute inset-0 bg-dark-950 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
              <div className="w-10 h-10 border-4 border-wine-500 border-t-transparent rounded-full animate-spin shadow-wine-glow" />
              <p className="text-xs text-dark-300 font-medium">Carregando player...</p>
            </div>
          )}

          <iframe
            key={`${playerUrl}-${selectedServer}`}
            src={playerUrl}
            title={`${item.title} Player`}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setPlayerLoading(false)}
          />
        </div>

        {/* Server Switch Quick Bar (if player gives error or unreleased) */}
        <div className="bg-dark-850/90 border-b border-dark-800 px-4 py-2 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2 text-dark-400">
            <Server className="w-3.5 h-3.5 text-wine-500" />
            <span>Alternar servidor se der 404 ou erro:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SERVERS.map((srv) => (
              <button
                key={srv.id}
                onClick={() => {
                  setSelectedServer(srv.id);
                  setPlayerLoading(true);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedServer === srv.id
                    ? 'bg-wine-600 text-white shadow-wine-glow'
                    : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750'
                }`}
              >
                {srv.name.split(' ')[0]} {srv.name.includes('Espelho') ? srv.name.split(' ')[1] : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Player Bottom Bar & Episode / Season Controls */}
        <div className="p-4 sm:p-6 bg-dark-900 flex-1 overflow-y-auto max-h-[40vh] space-y-6">
          {/* Quick info row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-800 pb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-dark-800 text-dark-200 border border-dark-750">
                {item.category}
              </span>
              <span className="text-xs text-dark-300 font-medium">
                {item.release_date?.substring(0, 4)}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {item.vote_average}
              </span>
              <span className="text-xs text-dark-400 font-mono">TMDB: #{item.id}</span>
            </div>

            {/* Next Episode button (for TV shows/animes) */}
            {!isMovie && (
              <button
                onClick={handleNextEpisode}
                className="px-3.5 py-1.5 rounded-lg bg-dark-800 hover:bg-wine-600 text-white text-xs font-semibold flex items-center gap-1.5 border border-dark-700 transition-colors"
              >
                Próximo Episódio <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Season & Episode Selector for Series, Animes, Cartoons */}
          {!isMovie && (
            <div className="space-y-4">
              {/* Season selection buttons */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-bold text-dark-400 uppercase tracking-wider mr-1">
                  Temporadas:
                </span>
                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSeason(s);
                      setSelectedEpisode(1);
                      setPlayerLoading(true);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedSeason === s
                        ? 'bg-wine-600 text-white shadow-wine-glow'
                        : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750 border border-dark-750'
                    }`}
                  >
                    Temp. {s}
                  </button>
                ))}
              </div>

              {/* Episodes Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider">
                  Episódios da Temporada {selectedSeason} ({episodes.length})
                </h3>

                {loadingEpisodes ? (
                  <div className="py-6 text-center text-xs text-dark-400">
                    Carregando episódios...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {episodes.map((ep) => {
                      const isActive = selectedEpisode === ep.episode_number;
                      return (
                        <button
                          key={ep.id || ep.episode_number}
                          onClick={() => {
                            setSelectedEpisode(ep.episode_number);
                            setPlayerLoading(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`p-2.5 rounded-xl text-left transition-all border ${
                            isActive
                              ? 'bg-wine-950/80 border-wine-500 text-white shadow-wine-glow'
                              : 'bg-dark-850 hover:bg-dark-800 border-dark-750 text-dark-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className={isActive ? 'text-wine-400' : 'text-dark-400'}>
                              EP {ep.episode_number}
                            </span>
                            {isActive && <CheckCircle className="w-3.5 h-3.5 text-wine-500" />}
                          </div>
                          <p className="text-xs font-semibold text-white truncate">
                            {ep.name || `Episódio ${ep.episode_number}`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Player Help Tip */}
          <div className="p-3.5 rounded-xl bg-dark-850/60 border border-dark-800 flex items-start gap-2.5 text-xs text-dark-400">
            <Info className="w-4 h-4 text-wine-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p>
                <strong className="text-dark-200">Como funciona o player:</strong> Os reprodutores conectam o ID do TMDB aos servidores públicos de streaming (SuperFlix, WarezCDN, Embedder).
              </p>
              <p>
                Se um título der 404, verifique se ele já foi lançado oficialmente ou alterne o servidor na barra acima.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
