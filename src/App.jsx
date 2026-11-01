import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ContentRow from './components/ContentRow';
import ContentCard from './components/ContentCard';
import PlayerModal from './components/PlayerModal';
import DetailModal from './components/DetailModal';
import SearchModal from './components/SearchModal';
import CategoryPage from './components/CategoryPage';
import SettingsModal from './components/SettingsModal';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('superflix_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Home Page Rows State
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [popularAnimes, setPopularAnimes] = useState([]);
  const [popularCartoons, setPopularCartoons] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [actionCategory, setActionCategory] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Modals State
  const [playerItem, setPlayerItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('superflix_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Load catalog on mount
  const loadHomeCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const [trend, movies, series, animes, cartoons, top, releases] = await Promise.all([
        api.getTrending(),
        api.getPopularMovies(),
        api.getPopularSeries(),
        api.getPopularAnimes(),
        api.getPopularCartoons(),
        api.getTopRated(),
        api.getNewReleases()
      ]);

      setTrending(trend || []);
      setPopularMovies(movies || []);
      setPopularSeries(series || []);
      setPopularAnimes(animes || []);
      setPopularCartoons(cartoons || []);
      setTopRated(top || []);
      setNewReleases(releases || []);

      // Action movies & series filter
      const actionItems = [...(movies || []), ...(animes || []), ...(series || [])].filter(
        item => item.genres && item.genres.some(g => g.toLowerCase().includes('ação'))
      );
      setActionCategory(actionItems.slice(0, 15));
    } catch (err) {
      console.error('Erro ao carregar catálogo:', err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    loadHomeCatalog();
  }, []);

  // Favorites handling
  const handleToggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id);
  };

  const handleOpenSearch = (initialQuery = '') => {
    setInitialSearchQuery(initialQuery);
    setSearchModalOpen(true);
  };

  const handleSelectSection = (sectionId) => {
    setCurrentSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col selection:bg-wine-700 selection:text-white">
      {/* Header / Navbar */}
      <Navbar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        onOpenSearch={handleOpenSearch}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onSelectItem={(item) => setDetailItem(item)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentSection === 'inicio' ? (
          <div>
            {/* Dynamic Hero Banner */}
            <HeroBanner
              featuredItems={trending.length > 0 ? trending.slice(0, 6) : []}
              onPlay={(item) => setPlayerItem(item)}
              onInfo={(item) => setDetailItem(item)}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />

            {/* Separated Rows by Category */}
            <div className="relative z-20 -mt-12 md:-mt-16 space-y-2 md:space-y-4 pb-16">
              {/* Row 1: Tendências em Alta */}
              <ContentRow
                title="Em Alta Hoje"
                subtitle="Os títulos mais assistidos e comentados do momento"
                items={trending}
                onPlay={(item) => setPlayerItem(item)}
                onInfo={(item) => setDetailItem(item)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />

              {/* Row 2: Filmes Populares */}
              <ContentRow
                title="Filmes Populares"
                subtitle="Grandes produções de Hollywood e cinema mundial"
                items={popularMovies}
                categoryFilter="filmes"
                onPlay={(item) => setPlayerItem(item)}
                onInfo={(item) => setDetailItem(item)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
                onViewAll={() => handleSelectSection('filmes')}
              />

              {/* Row 3: Séries Imperdíveis */}
              <ContentRow
                title="Séries Imperdíveis"
                subtitle="Maratone episódios completos das melhores séries de TV"
                items={popularSeries}
                categoryFilter="series"
                onPlay={(item) => setPlayerItem(item)}
                onInfo={(item) => setDetailItem(item)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
                onViewAll={() => handleSelectSection('series')}
              />

              {/* Row 4: Animes em Destaque */}
              <ContentRow
                title="Animes em Destaque"
                subtitle="O melhor da animação japonesa: Shonen, Isekai, Magia e Aventura"
                items={popularAnimes}
                categoryFilter="animes"
                onPlay={(item) => setPlayerItem(item)}
                onInfo={(item) => setDetailItem(item)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
                onViewAll={() => handleSelectSection('animes')}
              />

              {/* Row 5: Desenhos e Animações */}
              <ContentRow
                title="Desenhos & Animações"
                subtitle="Clássicos animados, sucessos da Disney, Pixar e DreamWorks"
                items={popularCartoons}
                categoryFilter="desenhos"
                onPlay={(item) => setPlayerItem(item)}
                onInfo={(item) => setDetailItem(item)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
                onViewAll={() => handleSelectSection('desenhos')}
              />

              {/* Row 6: Mais Bem Avaliados */}
              <ContentRow
                title="Aclamados pela Crítica"
                subtitle="Obras-primas com as notas mais altas do público e críticos"
                items={topRated}
                onPlay={(item) => setPlayerItem(item)}
                onInfo={(item) => setDetailItem(item)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />

              {/* Row 7: Lançamentos Recentes */}
              <ContentRow
                title="Lançamentos Recentes"
                subtitle="Novos filmes e conteúdos recém-chegados"
                items={newReleases}
                onPlay={(item) => setPlayerItem(item)}
                onInfo={(item) => setDetailItem(item)}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />

              {/* Row 8: Adrenalina & Ação */}
              {actionCategory.length > 0 && (
                <ContentRow
                  title="Ação & Adrenalina"
                  subtitle="Combates épicos, perseguições eletrizantes e aventuras intensas"
                  items={actionCategory}
                  onPlay={(item) => setPlayerItem(item)}
                  onInfo={(item) => setDetailItem(item)}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                />
              )}
            </div>
          </div>
        ) : (
          /* Dedicated Section View (Filmes, Séries, Animes, Desenhos, Favoritos) */
          <CategoryPage
            sectionId={currentSection}
            favorites={favorites}
            onPlay={(item) => setPlayerItem(item)}
            onInfo={(item) => setDetailItem(item)}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onBackToHome={() => handleSelectSection('inicio')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectSection={handleSelectSection} />

      {/* Video Player Modal (Superflix Embed API) */}
      {playerItem && (
        <PlayerModal
          item={playerItem}
          onClose={() => setPlayerItem(null)}
          onSelectItem={(item) => {
            setPlayerItem(null);
            setDetailItem(item);
          }}
        />
      )}

      {/* Details Modal */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onPlay={(item) => {
            setDetailItem(null);
            setPlayerItem(item);
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          onSelectItem={(item) => setDetailItem(item)}
        />
      )}

      {/* Full Search & Filter Modal */}
      {searchModalOpen && (
        <SearchModal
          initialQuery={initialSearchQuery}
          onClose={() => setSearchModalOpen(false)}
          onPlay={(item) => {
            setSearchModalOpen(false);
            setPlayerItem(item);
          }}
          onInfo={(item) => {
            setSearchModalOpen(false);
            setDetailItem(item);
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {/* Settings Modal (Player servers & API key) */}
      {settingsModalOpen && (
        <SettingsModal
          onClose={() => setSettingsModalOpen(false)}
          onReloadData={loadHomeCatalog}
        />
      )}
    </div>
  );
}

