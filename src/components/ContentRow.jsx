import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';

export default function ContentRow({
  title,
  subtitle,
  items = [],
  categoryFilter,
  onPlay,
  onInfo,
  onToggleFavorite,
  isFavorite,
  onViewAll
}) {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-4 md:py-6 group/row">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row Header */}
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-wine-500 rounded-full shadow-wine-glow" />
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-heading tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-dark-400 font-medium mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {onViewAll && (
            <button
              onClick={() => onViewAll(categoryFilter)}
              className="text-xs sm:text-sm font-semibold text-dark-400 hover:text-wine-400 flex items-center gap-1 transition-colors"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              aria-label="Rolar para esquerda"
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 sm:-ml-5 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-900/90 hover:bg-wine-600 text-white border border-dark-700/80 hover:border-wine-500 shadow-xl flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              aria-label="Rolar para direita"
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 sm:-mr-5 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-900/90 hover:bg-wine-600 text-white border border-dark-700/80 hover:border-wine-500 shadow-xl flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Scrollable Track */}
          <div
            ref={rowRef}
            onScroll={checkScroll}
            className="flex items-start gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {items.map((item) => (
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
        </div>
      </div>
    </section>
  );
}

