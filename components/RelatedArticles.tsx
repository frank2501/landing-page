import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../utils/content';

interface RelatedArticlesProps {
  articles: Article[];
}

const CompactArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Link 
      to={`/blog/${article.slug}`} 
      className="group flex flex-col h-full bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-sm hover:shadow-orange-500/5"
    >
      <div className="aspect-[16/9] overflow-hidden bg-zinc-800 relative">
        {article.frontmatter.image && article.frontmatter.image !== '/og-image.jpg' ? (
          <img
            src={article.frontmatter.image}
            alt={article.frontmatter.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-transparent">
            <svg className="w-6 h-6 text-orange-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500/80 font-semibold mb-2.5">
          {article.frontmatter.category}
        </div>
        <h3 className="text-base md:text-lg font-bold text-gray-100 group-hover:text-white transition-colors line-clamp-2 leading-tight">
          {article.frontmatter.title}
        </h3>
        <div className="mt-auto pt-4 flex items-center text-[11px] text-gray-500 font-medium">
          Continuar leyendo
          <svg className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <section className="mt-8 md:mt-12 pt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white/90">Te puede interesar</h2>
        <div className="h-[1px] flex-grow bg-white/5 ml-6" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
        {articles.map((article) => (
          <CompactArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
