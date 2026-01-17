import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { getRecentArticles } from '../utils/articles';

const LatestArticles: React.FC = () => {
  // Aumentamos la cantidad para que el slider tenga sentido
  const articles = getRecentArticles(6);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (articles.length === 0) {
    return null;
  }

  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  React.useEffect(() => {
    checkScroll();
    const current = scrollContainerRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const firstItem = current.firstElementChild as HTMLElement;
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth;
        const gap = 24; // gap-6 is 24px
        const scrollAmount = direction === 'left' ? -(itemWidth + gap) : (itemWidth + gap);
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        // checkScroll will be called by the scroll event listener
      }
    }
  };

  return (
    <section className="py-16 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA Y BOTÓN VER TODOS (INTACTOS, tal como tu original) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-7xl font-bold mb-4">Últimos artículos</h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
              Explorá nuestras últimas guías y casos de éxito sobre automatización.
            </p>
          </div>
          
          <Link
            to="/implementaciones"
            className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-2 transition-colors px-6 py-3 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 self-start md:self-auto"
          >
            Ver todos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* CARRUSEL CON FLECHAS LATERALES */}
        <div className="relative group/slider">
          
          {/* Botón Izquierda */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute -left-2 md:-left-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-zinc-900/90 border border-white/10 text-gray-400 shadow-xl shadow-black/50 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none ${canScrollLeft ? 'opacity-100 md:opacity-0 md:group-hover/slider:opacity-100' : 'opacity-0'}`}
            aria-label="Anterior"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Contenedor Scrollable */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 scrollbar-hide items-stretch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {articles.map((article) => (
              <div 
                key={article.slug} 
                className="flex-none w-[80vw] md:w-[400px] snap-center h-auto"
              >
                <div className="h-full">
                  <ArticleCard
                    slug={article.slug}
                    frontmatter={article.frontmatter}
                    excerpt={article.frontmatter.excerpt}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Botón Derecha */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute -right-2 md:-right-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-zinc-900/90 border border-white/10 text-gray-400 shadow-xl shadow-black/50 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none ${canScrollRight ? 'opacity-100 md:opacity-0 md:group-hover/slider:opacity-100' : 'opacity-0'}`}
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
};

export default LatestArticles;