import { Article } from './content';
import { getAllArticles } from './articles';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (baseUrl: string, staticPages: string[] = []): string => {
  const articles = getAllArticles();
  const urls: SitemapUrl[] = [];

  // Add static pages
  staticPages.forEach((page) => {
    urls.push({
      loc: `${baseUrl}${page}`,
      changefreq: page === '/' ? 'daily' : 'weekly',
      priority: page === '/' ? 1.0 : 0.8,
    });
  });

  // Add blog index
  urls.push({
    loc: `${baseUrl}/blog`,
    changefreq: 'daily',
    priority: 0.9,
  });

  // Add article pages
  articles.forEach((article) => {
    const lastmod = article.frontmatter.date
      ? new Date(article.frontmatter.date).toISOString().split('T')[0]
      : undefined;

    urls.push({
      loc: `${baseUrl}/blog/${article.slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.7,
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `    <priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
};

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};
