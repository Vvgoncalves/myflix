import React, { useState, useEffect, useRef } from 'react';
import { Search, Film, Tv, Sparkles, Heart, Settings, Menu, X, Play, SlidersHorizontal } from 'lucide-react';
import { api, getImageUrl } from '../services/api';

export default function Navbar({
  currentSection,
  onSelectSection,
  onOpenSearch,
  onOpenSettings,
  onSelectItem,
  favoritesCount = 0
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickResults, setQuickResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quick live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setQuickResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.searchCatalog({ query: searchQuery });
        setQuickResults(results.slice(0, 5));
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'filmes', label: 'Filmes' },
    { id: 'series', label: 'Séries' },
    { id: 'animes', label: 'Animes' },
    { id: 'desenhos', label: 'Desenhos' },
    { id: 'favoritos', label: 'Minha Lista', count: favoritesCount }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      onOpenSearch(searchQuery);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/90 backdrop-blur-md border-b border-dark-800 shadow-xl py-3'
          : 'bg-gradient-to-b from-dark-950/90 via-dark-950/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                onSelectSection('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine-500 via-wine-700 to-wine-900 flex items-center justify-center shadow-wine-glow transition-transform duration-300 group-hover:scale-105">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-wider font-heading text-white">
                  MY<span className="text-wine-500">FLIX</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-dark-400 font-semibold -mt-1">
                  Streaming
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-white bg-dark-800/80 shadow-inner'
                        : 'text-dark-300 hover:text-white hover:bg-dark-850/60'
                    }`}
                  >
                    {item.label}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 text-[11px] rounded-full bg-wine-600 text-white font-bold">
                        {item.count}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-wine-500 rounded-full shadow-wine-glow" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Search & Settings */}
          <div className="flex items-center gap-3">
            {/* Search Input Bar */}
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Pesquisar filmes, animes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  className="w-40 sm:w-60 md:w-72 lg:w-80 bg-dark-900/90 border border-dark-750 focus:border-wine-500 rounded-full pl-9 pr-9 py-1.5 text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-wine-500/20 transition-all duration-200"
                />
                <Search className="w-4 h-4 text-dark-400 absolute left-3 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className="absolute right-3 text-dark-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Instant Search Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-dropdown rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                  <div className="p-2 border-b border-dark-800 flex items-center justify-between text-xs text-dark-400 px-3">
                    <span>Resultados rápidos</span>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenSearch(searchQuery);
                      }}
                      className="text-wine-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      Ver pesquisa completa <SlidersHorizontal className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-dark-850">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-dark-400">Buscando...</div>
                    ) : quickResults.length > 0 ? (
                      quickResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setShowDropdown(false);
                            onSelectItem(item);
                          }}
                          className="flex items-center gap-3 p-2.5 hover:bg-dark-800/60 cursor-pointer transition-colors duration-150"
                        >
                          <img
                            src={getImageUrl(item.poster_path, 'w92')}
                            alt={item.title}
                            className="w-11 h-16 object-cover rounded-md flex-shrink-0 bg-dark-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-dark-300">
                              <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-dark-750 text-dark-200 font-bold">
                                {item.category}
                              </span>
                              <span>{item.release_date?.substring(0, 4)}</span>
                              <span className="text-amber-400 flex items-center gap-0.5">
                                ★ {item.vote_average}
                              </span>
                            </div>
                            <p className="text-xs text-dark-400 truncate mt-1">{item.overview}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-dark-400">
                        Nenhum resultado para "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Filter / Advanced Search Button */}
            <button
              onClick={() => onOpenSearch('')}
              title="Pesquisa Avançada com Categorias"
              className="p-2 rounded-lg bg-dark-850/80 hover:bg-dark-750 text-dark-200 hover:text-white border border-dark-750 transition-all duration-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Configurações do Player e Servidores"
              className="p-2 rounded-lg bg-dark-850/80 hover:bg-dark-750 text-dark-200 hover:text-white border border-dark-750 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-dark-850 text-dark-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-950/98 border-b border-dark-800 px-4 pt-3 pb-5 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-wine-600/20 text-white border-l-4 border-wine-500 font-semibold'
                    : 'text-dark-300 hover:bg-dark-900 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-wine-600 text-white font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

