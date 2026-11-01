import React, { useState, useEffect } from 'react';
import { Film, Tv, Sparkles, Heart, Filter, Star, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { GENRES_LIST } from '../data/mockData';
import ContentCard from './ContentCard';

export default function CategoryPage({
  sectionId,
  favorites = [],
  onPlay,
  onInfo,
  onToggleFavorite,
  isFavorite,
  onBackToHome
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [searchFilter, setSearchFilter] = useState('');

  const sectionMeta = {
    filmes: {
      title: 'Filmes',
      subtitle: 'Explorar os maiores sucessos do cinema mundial, lançamentos e clássicos',
      icon: Film,
      category: 'filme'
    },
    series: {
      title: 'Séries',
      subtitle: 'Maratone as melhores séries de drama, suspense, ação e comédia',
      icon: Tv,
      category: 'serie'
    },
    animes: {
      title: 'Animes',
      subtitle: 'Os melhores animes japoneses: Shonen, Isekai, Fantasia e Ação',
      icon: Sparkles,
      category: 'anime'
    },
    desenhos: {
      title: 'Desenhos e Animações',
      subtitle: 'Filmes e séries de animação para todas as idades e famílias',
      icon: Sparkles,
      category: 'desenho'
    },
    favoritos: {
      title: 'Minha Lista',
      subtitle: 'Seus filmes, séries, animes e desenhos salvos para assistir mais tarde',
      icon: Heart,
      category: 'all'
    }
  };

  const meta = sectionMeta[sectionId] || sectionMeta.filmes;
  const Icon = meta.icon;

  useEffect(() => {
    let isMounted = true;
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        if (sectionId === 'favoritos') {
          if (isMounted) setItems(favorites);
          return;
        }

        let data = [];
        if (sectionId === 'filmes') {
          data = await api.getPopularMovies();
        } else if (sectionId === 'series') {
          data = await api.getPopularSeries();
        } else if (sectionId === 'animes') {
          data = await api.getPopularAnimes();
        } else if (sectionId === 'desenhos') {
          data = await api.getPopularCartoons();
        }

        if (isMounted) {
          setItems(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCategoryData();
    return () => {
      isMounted = false;
    };
  }, [sectionId, favorites]);

  // Apply genre, search, and sort filters locally
  let filtered = [...items];

  if (sectionId === 'favoritos') {
    filtered = [...favorites];
  }

  if (selectedGenre !== 'all') {
    filtered = filtered.filter(
      (item) => item.genres && item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
    );
  }

  if (searchFilter.trim()) {
    const q = searchFilter.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.original_title.toLowerCase().includes(q) ||
        item.overview.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'rating') {
    filtered.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy === 'recent') {
    filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } else if (sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-wine-950/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-400 hover:text-white transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Início
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-wine-900/60 border border-wine-700 text-wine-400 shadow-wine-glow">
                <Icon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
                {meta.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-dark-300 max-w-xl">{meta.subtitle}</p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-dark-800/80 px-4 py-2 rounded-2xl border border-dark-750">
            <span className="text-xs font-bold text-dark-400 uppercase">Catálogo:</span>
            <span className="text-base font-extrabold text-white">{filtered.length} títulos</span>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-dark-800">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search within category */}
          <input
            type="text"
            placeholder={`Filtrar em ${meta.title}...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-dark-800 text-xs sm:text-sm text-white placeholder-dark-400 border border-dark-750 rounded-xl px-3 py-2 focus:border-wine-500 focus:outline-none w-48 sm:w-60"
          />

          {/* Genre selector */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-dark-800 text-xs sm:text-sm text-dark-200 border border-dark-750 rounded-xl px-3 py-2 focus:border-wine-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Gêneros</option>
            {GENRES_LIST.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-dark-400 uppercase hidden md:inline">
            Ordenar:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-800 text-xs sm:text-sm text-dark-200 border border-dark-750 rounded-xl px-3 py-2 focus:border-wine-500 focus:outline-none cursor-pointer"
          >
            <option value="popularity">Mais Populares</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="recent">Lançamento Mais Recente</option>
            <option value="title">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-wine-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-dark-400">Carregando catálogo de {meta.title}...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {filtered.map((item) => (
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
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhum título nesta seleção</h3>
          <p className="text-sm text-dark-400">
            {sectionId === 'favoritos'
              ? 'Você ainda não adicionou nenhum título à sua lista. Clique no ícone de coração para salvar seus favoritos!'
              : 'Tente alterar os filtros de gênero ou o termo de pesquisa.'}
          </p>
          {sectionId === 'favoritos' && (
            <button
              onClick={onBackToHome}
              className="wine-gradient-btn px-5 py-2.5 rounded-xl font-bold text-white text-xs inline-block"
            >
              Explorar Catálogo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

