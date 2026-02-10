import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleFrontmatter } from '../utils/content';

interface ArticleCardProps {
  slug: string;
  frontmatter: ArticleFrontmatter;
  excerpt?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ slug, frontmatter, excerpt }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="premium-border rounded-2xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300 group h-full">
      <Link to={`/implementaciones/${slug}`} className="flex flex-col h-full">
        <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-br from-orange-500/10 via-zinc-800/50 to-zinc-900 shrink-0">
          <img
            src={frontmatter.image && frontmatter.image !== '/og-image.jpg' ? frontmatter.image : '/images/article-fallback.svg'}
            alt={frontmatter.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Si la imagen falla, usar el fallback
              const target = e.target as HTMLImageElement;
              if (target.src.indexOf('article-fallback.svg') === -1) {
                 target.src = '/images/article-fallback.svg';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="p-6 md:p-8 flex-grow flex flex-col">
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-400">
            {frontmatter.category && (
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {frontmatter.category}
              </span>
            )}
            <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
            {frontmatter.title}
          </h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            {excerpt || frontmatter.excerpt || frontmatter.description}
          </p>
          <span className="mt-auto text-orange-400 font-medium group-hover:gap-2 transition-all inline-flex items-center gap-1">
            Leer más
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
