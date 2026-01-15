import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/SEO/MetaTags';
import StructuredData, { generateWebSiteSchema } from '../components/SEO/StructuredData';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import BackgroundStars from '../components/BackgroundStars';
import { getAllArticles, getAllCategories, getAllTags } from '../utils/articles';

const BlogPage: React.FC = () => {
  const [articles, setArticlesState] = useState(getAllArticles());
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const categories = getAllCategories();
  const tags = getAllTags();

  // Reload articles on mount to ensure they're loaded
  useEffect(() => {
    const allArticles = getAllArticles();
    console.log('📖 BlogPage: Found articles:', allArticles.length);
    setArticlesState(allArticles);
  }, []);

  useEffect(() => {
    let filtered = getAllArticles();

    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.frontmatter.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(
        (article) =>
          article.frontmatter.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    setArticlesState(filtered);
    setCurrentPage(1);
  }, [selectedCategory, selectedTag]);

  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = articles.slice(startIndex, startIndex + articlesPerPage);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const siteName = 'Teddy Automations';

  const websiteSchema = generateWebSiteSchema(siteName, siteUrl);

  return (
    <div className="min-h-screen bg-transparent selection:bg-orange-500/30">
      <BackgroundStars />
      
      <MetaTags
        title={`Blog | ${siteName}`}
        description="Artículos sobre automatización, digitalización y crecimiento de negocios. Aprende cómo escalar tu negocio sin tareas manuales."
        url={`${siteUrl}/blog`}
      />
      <StructuredData data={websiteSchema} />

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <header className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6">
              Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Descubrí cómo automatizar tu negocio y crecer sin límites
            </p>
          </header>

          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedTag('');
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                !selectedCategory && !selectedTag
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedTag('');
                }}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {selectedTag && (
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Etiqueta: {selectedTag}
                <button
                  onClick={() => setSelectedTag('')}
                  className="hover:text-orange-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          )}

          {paginatedArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No se encontraron artículos.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                {paginatedArticles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    slug={article.slug}
                    frontmatter={article.frontmatter}
                    excerpt={article.frontmatter.excerpt}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
        <FloatingWhatsApp />
      </div>
    </div>
  );
};

export default BlogPage;
