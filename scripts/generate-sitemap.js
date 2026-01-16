// Build script to generate sitemap.xml
// Run this after building: node scripts/generate-sitemap.js

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = process.env.SITE_URL || 'https://yoursite.com';
const contentDir = path.join(__dirname, '../content');
const outputPath = path.join(__dirname, '../public/sitemap.xml');

// Get all markdown files
const markdownFiles = glob.sync('**/*.md', { cwd: contentDir });

const urls = [];

// Add static pages
urls.push({
  loc: baseUrl,
  changefreq: 'daily',
  priority: 1.0,
});

urls.push({
  loc: `${baseUrl}/implementaciones`,
  changefreq: 'daily',
  priority: 0.9,
});

// Add article pages
markdownFiles.forEach((file) => {
  const filePath = path.join(contentDir, file);
  const content = readFileSync(filePath, 'utf-8');
  const { data } = matter(content);
  
  const slug = data.slug || file.replace('.md', '').replace(/\//g, '-');
  const lastmod = data.date ? new Date(data.date).toISOString().split('T')[0] : undefined;

  urls.push({
    loc: `${baseUrl}/implementaciones/${slug}`,
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

writeFileSync(outputPath, xml, 'utf-8');
console.log(`✅ Sitemap generated at ${outputPath}`);
console.log(`   Found ${markdownFiles.length} articles`);

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
