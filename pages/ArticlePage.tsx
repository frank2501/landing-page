import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MetaTags from '../components/SEO/MetaTags';
import StructuredData, { generateArticleSchema } from '../components/SEO/StructuredData';
import Breadcrumb from '../components/Breadcrumb';
import TableOfContents from '../components/TableOfContents';
import RelatedArticles from '../components/RelatedArticles';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import BackgroundStars from '../components/BackgroundStars';
import { getArticleBySlug, getRelatedArticles, getAllArticles } from '../utils/articles';
import { extractHeadings, addHeadingIds } from '../utils/content';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ReturnType<typeof getArticleBySlug> | null>(null);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    if (!slug) {
      navigate('/404');
      return;
    }

    // Try to find article immediately
    let foundArticle = getArticleBySlug(slug);
    
    // If not found, wait a bit and try again (in case articles are still loading)
    if (!foundArticle) {
      const timer = setTimeout(() => {
        foundArticle = getArticleBySlug(slug);
        const allArticles = getAllArticles();
        console.log(`🔍 Looking for article with slug: "${slug}"`);
        console.log(`📋 Available articles:`, allArticles.map(a => a.slug));
        
        if (!foundArticle) {
          console.warn(`❌ Article not found with slug: "${slug}"`);
          navigate('/404');
          return;
        }

        setArticle(foundArticle);
        
        // Extract headings and add IDs to HTML
        const extractedHeadings = extractHeadings(foundArticle.html);
        setHeadings(extractedHeadings);
        
        // Add IDs to headings in the HTML
        const htmlWithIds = addHeadingIds(foundArticle.html);
        foundArticle.html = htmlWithIds;
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // Article found immediately
      setArticle(foundArticle);
      
      // Extract headings and add IDs to HTML
      const extractedHeadings = extractHeadings(foundArticle.html);
      setHeadings(extractedHeadings);
      
      // Add IDs to headings in the HTML
      const htmlWithIds = addHeadingIds(foundArticle.html);
      foundArticle.html = htmlWithIds;
    }
  }, [slug, navigate]);

  if (!article) {
    return null;
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const articleUrl = `${siteUrl}/blog/${article.slug}`;
  const siteName = 'Teddy Automations';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: article.frontmatter.title, url: `/blog/${article.slug}` },
  ];

  const articleSchema = generateArticleSchema(
    article.frontmatter.title,
    article.frontmatter.description,
    article.frontmatter.image || '/og-image.jpg',
    articleUrl,
    {
      name: article.frontmatter.author,
      url: article.frontmatter.authorUrl,
    },
    article.frontmatter.date,
    article.frontmatter.date,
    siteName
  );

  const relatedArticles = getRelatedArticles(article, 3);

  return (
    <div className="min-h-screen bg-transparent selection:bg-orange-500/30">
      <BackgroundStars />
      
      <MetaTags
        title={`${article.frontmatter.title} | ${siteName}`}
        description={article.frontmatter.description}
        image={article.frontmatter.image}
        url={articleUrl}
        type="article"
        author={article.frontmatter.author}
        publishedTime={article.frontmatter.date}
        modifiedTime={article.frontmatter.date}
        canonicalUrl={articleUrl}
      />
      <StructuredData data={articleSchema} />

      <div className="relative z-10 w-full">
        <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-8 md:mb-12">
            {article.frontmatter.category && (
              <span className="inline-block px-4 py-2 mb-4 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm font-medium">
                {article.frontmatter.category}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {article.frontmatter.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-6 leading-relaxed">
              {article.frontmatter.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{article.frontmatter.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={article.frontmatter.date}>
                  {formatDate(article.frontmatter.date)}
                </time>
              </div>
            </div>
          </header>

          {article.frontmatter.image && (
            <div className="mb-8 md:mb-12 rounded-2xl overflow-hidden premium-border">
              <img
                src={article.frontmatter.image}
                alt={article.frontmatter.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 md:gap-12">
            <main className="prose prose-invert prose-lg max-w-none">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.html }}
                style={{
                  color: '#e5e7eb',
                }}
              />
              <style>{`
                .article-content h2 {
                  font-size: 2.25rem;
                  font-weight: 800;
                  margin-top: 4.5rem;
                  margin-bottom: 2rem;
                  color: #fff;
                  letter-spacing: -0.02em;
                  line-height: 1.2;
                }
                .article-content h3 {
                  font-size: 1.75rem;
                  font-weight: 700;
                  margin-top: 3.5rem;
                  margin-bottom: 1.5rem;
                  color: #fff;
                  letter-spacing: -0.01em;
                }
                .article-content p {
                  margin-bottom: 1.8rem;
                  line-height: 1.85;
                  color: #cbd5e1;
                  font-size: 1.125rem;
                }
                .article-content a {
                  color: #fb923c;
                  text-decoration: none;
                  border-bottom: 1px solid rgba(251, 146, 60, 0.3);
                  transition: all 0.2s;
                }
                .article-content a:hover {
                  color: #f97316;
                  border-bottom-color: #f97316;
                }
                .article-content ul, .article-content ol {
                  margin-bottom: 2.5rem;
                  padding-left: 0.5rem;
                  list-style: none;
                }
                .article-content li {
                  margin-bottom: 1rem;
                  color: #cbd5e1;
                  position: relative;
                  padding-left: 1.75rem;
                  line-height: 1.7;
                }
                .article-content ul li::before {
                  content: "";
                  position: absolute;
                  left: 0;
                  top: 0.65em;
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background-color: #f97316;
                  box-shadow: 0 0 8px rgba(249, 115, 22, 0.4);
                }
                .article-content code {
                  background: rgba(255, 255, 255, 0.05);
                  padding: 0.2rem 0.45rem;
                  border-radius: 0.5rem;
                  font-size: 0.9em;
                  color: #fdba74;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .article-content pre {
                  background: #09090b;
                  padding: 1.5rem;
                  border-radius: 1rem;
                  overflow-x: auto;
                  margin: 2.5rem 0;
                  border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .article-content pre code {
                  background: none;
                  padding: 0;
                  color: #e2e8f0;
                  border: none;
                }
                .article-content img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 1.5rem;
                  margin: 3.5rem 0;
                  box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
                }
                .article-content blockquote {
                  border-left: 4px solid #f97316;
                  background: rgba(249, 115, 22, 0.03);
                  padding: 2rem 2.5rem;
                  border-radius: 0 1rem 1rem 0;
                  margin: 3.5rem 0;
                  color: #94a3b8;
                  font-style: italic;
                  font-size: 1.25rem;
                  line-height: 1.6;
                }
                .article-content hr {
                  border: 0;
                  height: 1px;
                  background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
                  margin: 4rem 0;
                }
              `}</style>
            </main>

            <aside>
              <TableOfContents headings={headings} />
            </aside>
          </div>

          <RelatedArticles articles={relatedArticles} />
        </article>

        <Footer />
        <FloatingWhatsApp />
      </div>
    </div>
  );
};

export default ArticlePage;
