import React from 'react';
import { Play, Heart, Film, Tv, Sparkles, Shield, Code2 } from 'lucide-react';

export default function Footer({ onSelectSection }) {
  return (
    <footer className="bg-dark-950 border-t border-dark-850/80 pt-16 pb-12 text-dark-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-wine-500 to-wine-900 flex items-center justify-center shadow-wine-glow">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              <span className="text-xl font-black tracking-wider text-white font-heading">
                SUPER<span className="text-wine-500">FLIX</span>
              </span>
            </div>
            <p className="text-xs text-dark-400 leading-relaxed">
              Plataforma moderna e minimalista para explorar e assistir filmes, séries, animes e
              desenhos animados com visual elegante e player integrado.
            </p>
            <div className="flex items-center gap-2 text-xs text-dark-500">
              <span className="w-2 h-2 rounded-full bg-wine-500" />
              <span>Design em Cinza, Preto, Branco & Vinho</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectSection('inicio')}
                  className="hover:text-wine-400 transition-colors"
                >
                  Início (Catálogo Completo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('filmes')}
                  className="hover:text-wine-400 transition-colors"
                >
                  Filmes em Destaque
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('series')}
                  className="hover:text-wine-400 transition-colors"
                >
                  Séries Populares
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('animes')}
                  className="hover:text-wine-400 transition-colors"
                >
                  Animes Japoneses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('desenhos')}
                  className="hover:text-wine-400 transition-colors"
                >
                  Desenhos & Animações
                </button>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recursos</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine-500" /> Player Embed SuperFlix API
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine-500" /> Pesquisa Avançada com Categorias
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine-500" /> Seletor de Temporadas e Episódios
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine-500" /> Minha Lista / Favoritos Local
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine-500" /> Servidores Alternativos de Backup
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Aviso Legal</h4>
            <p className="text-xs text-dark-500 leading-relaxed">
              Este site não armazena arquivos de vídeo em seus servidores. Todos os conteúdos e
              transmissões são vinculados externamente via reprodutores da API SuperFlix e serviços
              de terceiros. Dados de catálogo e imagens fornecidos pelo TMDB.
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-dark-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-500">
          <p>© {new Date().getFullYear()} SuperFlix Streaming. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Feito com design moderno & animações suaves
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

