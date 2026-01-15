import React from 'react';
import { Article } from '../utils/content';
import ArticleCard from './ArticleCard';

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16 md:mt-24 pt-16 md:pt-24 border-t border-white/10">
      <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">Artículos relacionados</h2>
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
    </section>
  );
};

export default RelatedArticles;
