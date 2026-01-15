// Utility to generate sitemap.xml file
// This can be run as a build script or server endpoint

import { writeFileSync } from 'fs';
import { generateSitemap } from './sitemap';
import { getAllArticles } from './articles';

export const generateSitemapFile = (outputPath: string, baseUrl: string) => {
  const staticPages = ['/', '/blog'];
  const xml = generateSitemap(baseUrl, staticPages);
  writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Sitemap generated at ${outputPath}`);
};
