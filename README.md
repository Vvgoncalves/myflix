# 🎬 MYFLIX — Plataforma de Streaming Moderna

Uma plataforma de streaming e catálogo de filmes, séries, animes e desenhos moderna, elegante e minimalista. Desenvolvida com a paleta de cores solicitada: **Preto, Cinza e Branco**, com destaques vibrantes em **Vermelho/Vinho**, integrada ao reprodutor embed da **API SuperFlix** e metadados oficiais via TMDB em Português (`pt-BR`).

---

## ✨ Principais Funcionalidades

### 1. 🎨 Design Moderno & "Smuf" (Smooth)
- **Paleta de Cores**: Fundo preto e grafite profundo (`#070709`, `#0d0d11`, `#18181f`), textos e metadados em cinza suave e branco puro, com acentos, botões e efeitos de brilho em vermelho/vinho (`#e50914`, `#9f1239`, `#881337`).
- **Animações Fluidas**: Efeitos de zoom suave (`hover:scale-105`), transição com brilho diagonal reflexivo (*card shine*), carrosséis horizontais com rolagem dinâmica e setas automáticas, modais com desfoque de fundo (*backdrop-blur*).

### 2. 🏠 Página "Iniciar" (Home) com Categorias Separadas
O catálogo inicial apresenta várias linhas categorizadas, organizando tudo de forma intuitiva:
- 🔥 **Em Alta Hoje**: Principais tendências e destaques da semana.
- 🎬 **Filmes Populares**: Os maiores sucessos de bilheteria e lançamentos cinematográficos.
- 📺 **Séries Imperdíveis**: Séries premiadas e aclamadas pelo público.
- ⚡ **Animes em Destaque**: O melhor da animação japonesa (*Shonen, Isekai, Fantasia* - Demon Slayer, Jujutsu Kaisen, One Piece, Attack on Titan, Solo Leveling, etc.).
- 🎨 **Desenhos & Animações**: Clássicos animados para todas as idades (Aranhaverso, Arcane, Divertida Mente, Rick and Morty, Avatar, etc.).
- ⭐ **Aclamados pela Crítica**: Títulos com as notas mais altas do TMDB/IMDb (8.0+).
- 🍿 **Lançamentos Recentes**: Títulos recém-chegados às telas.
- 💥 **Ação & Adrenalina**: Títulos eletrizantes de ação, aventura e ficção.

### 3. 🔍 Sistema de Pesquisa Completo com Categorias
- **Pesquisa em Tempo Real**: Barra de pesquisa no cabeçalho com sugestões automáticas conforme você digita.
- **Painel de Busca Avançada**:
  - Filtro por Tipo/Categoria: *Todos*, *Filmes*, *Séries*, *Animes*, *Desenhos*.
  - Filtro por Gênero: *Ação, Comédia, Drama, Ficção Científica, Terror, Fantasia, Romance, Mistério, etc.*
  - Ordenação dinâmica: *Mais Populares, Melhores Avaliados, Mais Recentes, Ordem Alfabética (A-Z)*.

### 4. 🧭 Navegação por Sessões no Cabeçalho
- **Início**: Visão completa com carrosséis e banners cinematográficos.
- **Filmes**: Catálogo dedicado de filmes com filtros e busca interna.
- **Séries**: Catálogo de séries com controle de temporadas.
- **Animes**: Sessão focada exclusivamente em animação japonesa.
- **Desenhos**: Animações ocidentais, Disney, Pixar e DreamWorks.
- **Minha Lista**: Favoritos salvos automaticamente no navegador (`localStorage`).

### 5. 🍿 Integração com Reprodutor SuperFlix API
O reprodutor embed conecta dinamicamente o ID do título ao player da SuperFlix:
- **Para Filmes**:
  ```html
  https://superflixapi.fun/embed/filme/{TMDB_ID}
  ```
- **Para Séries / Animes / Desenhos**:
  ```html
  https://superflixapi.fun/embed/serie/{TMDB_ID}/{TEMPORADA}/{EPISODIO}
  ```
- **Seletor de Servidores**: O player inclui seletor rápido para alternar entre:
  - Servidor Principal (`superflixapi.fun`)
  - Servidor Espelho 1 (`superflixapi.top`)
  - Servidor Embed Alternativo (`embed.superflixapi.top`)
  - Servidor Alternativo VidSrc (`vidsrc.xyz`)
- **Seletor de Temporadas e Episódios**: Grid visual com navegação rápida de episódios e botão "Próximo Episódio".
- **Modo Teatro e Nova Aba**: Alternância rápida de visualização para máximo conforto.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior instalado)

### Passo a Passo

1. **Entrar na pasta do projeto**:
   ```bash
   cd c:\Users\vitor\OneDrive\Documentos\projeto
   ```

2. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. Abra seu navegador no endereço exibido (geralmente `http://localhost:3000` ou `http://localhost:5173`).

### Gerar Versão Otimizada para Produção
```bash
npm run build
```
Os arquivos prontos serão gerados na pasta `dist/`.

---

## 🛠️ Tecnologias Utilizadas
- **React 18** (Interface declarativa, moderna e ultra rápida)
- **Vite** (Build tool de altíssima performance)
- **Tailwind CSS** (Estilização responsiva com suporte a temas e micro-interações)
- **Lucide Icons** (Ícones modernos e minimalistas)
- **TMDB API v3** (Catálogo de metadados, capas, sinopses e notas em `pt-BR`)
- **SuperFlix API Embed** (Players de vídeo com dublado/legendado)
- **LocalStorage API** (Persistência de favoritos e configurações do usuário)

