import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Film, Tv, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { GENRES_LIST } from '../data/mockData';
import ContentCard from './ContentCard';

export default function SearchModal({
  initialQuery = '',
  onClose,
  onPlay,
  onInfo,
  onToggleFavorite,
  isFavorite
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const [genre, setGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos os Tipos' },
    { id: 'filme', label: 'Filmes' },
    { id: 'serie', label: 'Séries' },
    { id: 'anime', label: 'Animes' },
    { id: 'desenho', label: 'Desenhos' }
  ];

  const sortOptions = [
    { id: 'popularity', label: 'Mais Populares' },
    { id: 'rating', label: 'Melhores Avaliados' },
    { id: 'recent', label: 'Mais Recentes' },
    { id: 'title', label: 'Ordem Alfabética (A-Z)' }
  ];

  // Perform search when filters or query change
  useEffect(() => {
    let isMounted = true;
    const performSearch = async () => {
      setLoading(true);
      try {
        const data = await api.searchCatalog({
          query,
          category,
          genre,
          sortBy
        });
        if (isMounted) {
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(performSearch, query ? 300 : 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, category, genre, sortBy]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-fadeIn">
      {/* Top Search Header */}
      <div className="p-4 sm:p-6 border-b border-dark-800 bg-dark-900/80">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-3xl">
              <input
                type="text"
                autoFocus
                placeholder="Pesquisar por título, diretor, personagem, anime, etc..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700 focus:border-wine-500 rounded-2xl pl-12 pr-12 py-3.5 text-base text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-wine-500/20 transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-dark-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-dark-800 hover:bg-wine-600 text-white border border-dark-700 transition-colors flex-shrink-0"
              title="Fechar pesquisa"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-dark-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Categoria:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    category === cat.id
                      ? 'bg-wine-600 text-white shadow-wine-glow'
                      : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750 border border-dark-750'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Dropdown Filters: Genre & Sort */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Genre Dropdown */}
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-dark-800 text-xs sm:text-sm text-dark-200 border border-dark-700 rounded-xl px-3 py-1.5 focus:border-wine-500 focus:outline-none cursor-pointer"
              >
                <option value="all">Todos os Gêneros</option>
                {GENRES_LIST.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark-800 text-xs sm:text-sm text-dark-200 border border-dark-700 rounded-xl px-3 py-1.5 focus:border-wine-500 focus:outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Status bar */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-dark-400">
            <span>
              {loading ? (
                'Buscando no catálogo...'
              ) : (
                <>
                  Encontrados <strong className="text-white">{results.length}</strong> títulos
                  {query && <span> para "{query}"</span>}
                </>
              )}
            </span>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-wine-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-dark-400">Pesquisando catálogo do SuperFlix...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {results.map((item) => (
                <ContentCard
                  key={`${item.id}-${item.category}`}
                  item={item}
                  onPlay={onPlay}
                  onInfo={onInfo}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-dark-850 flex items-center justify-center mx-auto text-dark-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Nenhum título encontrado</h3>
              <p className="text-sm text-dark-400">
                Tente buscar por termos diferentes ou selecione outra categoria e gênero acima.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {['Duna', 'Kimetsu', 'Stranger Things', 'Aranhaverso', 'One Piece'].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setQuery(sug)}
                    className="px-3 py-1 rounded-full text-xs bg-dark-800 text-dark-300 hover:text-white hover:bg-wine-600 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

