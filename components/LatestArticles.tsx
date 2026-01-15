import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { getRecentArticles } from '../utils/articles';

const LatestArticles: React.FC = () => {
  const articles = getRecentArticles(6);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <h2 className="text-4xl md:text-7xl font-bold">Últimos artículos</h2>
          <Link
            to="/blog"
            className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-2 transition-colors"
          >
            Ver todos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              frontmatter={article.frontmatter}
              excerpt={article.frontmatter.excerpt}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
